import { createIntegratedUi } from '#imports';
import { createRoot } from 'react-dom/client';
import { App, main, registerStorageListener, unregisterStorageListener } from './other/content_script.tsx';
import '@/entrypoints/styles.scss';

let loggedInListenerRegistered = false;

export default defineContentScript({
    matches: ['*://*.archiveofourown.org/*'],
    runAt: 'document_end',

    main: function (ctx) {
        logger.debug('content script running');
        const ui = createIntegratedUi(ctx, {
            position: 'inline',
            anchor: 'h1',
            append: 'last',
            onMount: (container) => {
                logger.info('Container found, mounting...');
                // Create a root on the UI container and render a component
                container.classList.add('content-script-root');
                const root = createRoot(container);
                root.render(
                    <App />
                );
                if (!loggedInListenerRegistered) {
                    registerStorageListener();
                    loggedInListenerRegistered = true;
                }
                main(ctx);
                container.setAttribute('style', 'display: inline;');
                return root;
            },
            onRemove: (root) => {
                logger.info('Content script UI removed, unmounting root and unregistering storage listener...');

                // Unmount the root when the UI is removed
                (root != undefined) ? root.unmount() : undefined;
                unregisterStorageListener();
                loggedInListenerRegistered = false;
            }
        });

        // Call mount to add the UI to the DOM
        ui.mount();
    }
});
