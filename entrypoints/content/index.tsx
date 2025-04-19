// @ts-ignore
import { handleVisibilityChange, main, main as contentScriptMain, messageListener } from "./other/content_script.tsx";
import { createIntegratedUi } from "wxt/client";
import { App } from "./other/content_script.tsx"
import ReactDOM from "react";
import { createRoot } from "react-dom/client";


export * from "../../utils/Ao3_BaseWork.ts"
export * from "../../utils/Work.tsx";

export default defineContentScript({
    matches: ["*://*.archiveofourown.org/*"],
    runAt: "document_end",
    main(ctx) {
        console.log('content script running');
        const ui = createIntegratedUi(ctx, {
            position: 'inline',
            anchor: 'body',
            onMount: (container) => {
                // Create a root on the UI container and render a component
                const root = createRoot(container);
                root.render(
                    <App />
                );
                main(ctx);
                return root;
            },
            onRemove: (root) => {
                // Unmount the root when the UI is removed
                (root != undefined) ? root.unmount() : undefined;
            },
        });

        // Call mount to add the UI to the DOM
        ui.mount();
        },
});

