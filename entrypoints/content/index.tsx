// @ts-ignore
import { handleVisibilityChange, main, main as contentScriptMain, messageListener } from "./other/content_script.tsx";
import { createIntegratedUi } from "wxt/client";
import { App } from "./other/content_script.tsx"
import ReactDOM from "react";
import { createRoot } from "react-dom/client";
import { onMessage } from "@/utils/browser-services";
import { handleLoggedIn} from "@/utils/browser-services";


export * from "../../utils/Ao3_BaseWork.ts"
export * from "../../utils/Work.tsx";

export default defineContentScript({
    matches: ["*://*.archiveofourown.org/*"],
    runAt: "document_end",

    main(ctx) {
        console.log('content script running');
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
        onMessage('LoggedIn', handleLoggedIn);
    },
});

