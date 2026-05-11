import React, { useRef } from 'react';
import { AddWorkControl, BlurbInfo, IncrementReadCountControl, RemoveWorkControl } from '@/components';
import { BlurbStoreContext, BlurbStoreType, createBlurbStore, useBlurbWorkId, useWork } from '@/stores';

/**
 * Renders the blurb panel with controls and metadata for a target blurb.
 *
 * @param workId - Work identifier used to initialize the blurb store.
 * @param targetBlurb - Blurb DOM element that the store reads from.
 *
 * @remarks Creates a per-panel store and provides it via context.
 * @returns The blurb panel content, including controls and info, wrapped in the store context provider.
 */
export function BlurbPanelContent({ workId, targetBlurb }: { workId: string; targetBlurb: Element }) {
    const storeRef = useRef<BlurbStoreType>();
    if (!storeRef.current) {
        storeRef.current = createBlurbStore({ workId, targetBlurb });
    }

    return (
        <BlurbStoreContext.Provider value={storeRef.current}>
            <WorkControls />
            <BlurbInfo />
        </BlurbStoreContext.Provider>
    );
}

/**
 * Displays work-specific action controls based on store state.
 */
function WorkControls() {
    const workId = useBlurbWorkId();
    const work = useWork(workId);

    return (
        <ul className="blurb-controls actions">
            { work ? (
                <>
                    <RemoveWorkControl />
                    <IncrementReadCountControl />
                </>
            ) : (
                <AddWorkControl />
            ) }
        </ul>
    );
}