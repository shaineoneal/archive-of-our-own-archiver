import React, { useRef } from "react";
import { AddWorkControl, BlurbInfo, IncrementReadCountControl, RemoveWorkControl } from "@/components";
import { BlurbStoreContext, BlurbStoreType, createBlurbStore, useBlurbWorkId, useWork } from "@/stores";


/**
 * Panel content for one blurb, wiring local context and subcomponents.
 * @param props - Panel props containing `workId` and `targetBlurb`.
 * @returns Provider-wrapped controls and metadata UI.
 */
export function BlurbPanelContent({ workId, targetBlurb }: { workId: string; targetBlurb: Element }) {
    const storeRef = useRef<BlurbStoreType>();
    if (!storeRef.current) {
        storeRef.current = createBlurbStore({ workId, targetBlurb });
    }

    return (
        <BlurbStoreContext.Provider value={storeRef.current}>
            <WorkControls/>
            <BlurbInfo/>
        </BlurbStoreContext.Provider>
    );
}

/** Renders the add/remove controls based on whether the current blurb work exists in the store. */
function WorkControls() {
    const workId = useBlurbWorkId();
    const work = useWork(workId);

    return (
        <div className="blurb-controls actions">
            { work ? (
                <>
                    <RemoveWorkControl/>
                    <IncrementReadCountControl/>
                </>
            ) : (
                <AddWorkControl/>
            ) }
        </div>
    );
};



