// @ts-ignore
import { createIntegratedUi } from "#imports";
import { handleLoggedIn, onMessage } from "@/utils/browser-services";
import { createRoot } from "react-dom/client";
import { App, main, registerStorageListener, unregisterStorageListener } from "./other/content_script.tsx";


export * from "../../utils/Ao3_BaseWork.ts";
export * from "../../utils/Work.tsx";

let loggedInListenerRegistered = false;

export default defineContentScript({
    matches: ["*://*.archiveofourown.org/*"],
    runAt: "document_end",

    main(ctx) {
        logger.debug('content script running');
        const ui = createIntegratedUi(ctx, {
            position: 'inline',
            anchor: 'h1',
            append: 'last',
            onMount: (container) => {
                // Create a root on the UI container and render a component
                const root = createRoot(container);
                root.render(
                    <App />
                );
                registerStorageListener();
                main(ctx);
                container.setAttribute("style", "display: inline;");
                return root;
            },
            onRemove: (root) => {
                // Unmount the root when the UI is removed
                (root != undefined) ? root.unmount() : undefined;
                unregisterStorageListener();
            },
        });

        // Call mount to add the UI to the DOM
        ui.mount();
        if (!loggedInListenerRegistered) {
            onMessage('LoggedIn', handleLoggedIn);
            loggedInListenerRegistered = true;
        }
    },
});

