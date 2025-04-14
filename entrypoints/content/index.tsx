// @ts-ignore
import { handleVisibilityChange, main as contentScriptMain, messageListener } from "./content_script";
import React from "react";
import ReactDOM from "react";
import { createRoot } from 'react-dom/client';
import { ContentScriptContext } from "wxt/client";
import { MantineProvider } from "@mantine/core";

export * from "./Ao3_BaseWork.ts"
export * from "./Work.tsx";

export default defineContentScript({
    matches: ["*://*.archiveofourown.org/*"],
    runAt: "document_end",
    cssInjectionMode: "ui",
    async main(ctx) {
        const ui = await createUi(ctx);
        ui.mount()
        console.log('content script running');
        document.addEventListener('visibilitychange', handleVisibilityChange);
    },
});

function createUi(ctx: ContentScriptContext) {
    return createShadowRootUi(ctx, {
        name: "mantine-example",
        position: "inline",
        append: "first",
        onMount(uiContainer, shadow) {
            const app = document.createElement("div");
            uiContainer.append(app);

            // Create a root on the UI container and render a component
            const root = createRoot(app);
            root.render(
                <React.StrictMode>
                    <MantineProvider
                        theme={theme}
            cssVariablesSelector="html"
            getRootElement={() => shadow.querySelector("html")!}
        >
            <p>hi
                </p>
            </MantineProvider>
            </React.StrictMode>,
        );
            return root;
        },
        onRemove(root) {
            root?.unmount();
        },
    });
}