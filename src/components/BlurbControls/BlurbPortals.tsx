import React, { useEffect, useRef } from 'react';
import { BlurbPanelContent } from '@/components';
import { createPortal } from 'react-dom';

/** Props used to render controls into a specific blurb via a React portal. */
interface DynamicPortalProps {
    /** Target AO3 blurb element to host the controls. */
    targetBlurb: Element;
    /** Controls/content to render into the target blurb. */
    children: React.ReactNode;
    /** Stable key used by `createPortal`. */
    portalKey: string;
}

/**
 * Creates and manages a per-blurb portal host injected into the target element.
 *
 * @param props - Portal rendering configuration.
 * @remarks Adds the `ao4-blurb-with-controls` class and prepends a `.ao4-blurb-panel` host
 * to the target blurb, removing it on cleanup.
 * @returns A portal for the provided `children`, or `null` before host creation.
 */
function DynamicPortal({ targetBlurb, children, portalKey }: DynamicPortalProps) {
    const portalNodeRef = useRef<HTMLDivElement | null>(null);

    if (portalNodeRef.current === null) {
        portalNodeRef.current = document.createElement('div');
        portalNodeRef.current.className = 'ao4-blurb-panel blurb work group';
        portalNodeRef.current.id = `${targetBlurb.id}-controls`;
    }

    useEffect(() => {
        const host = portalNodeRef.current;
        if (!host) {
            return;
        }

        targetBlurb.classList.add('ao4-blurb-with-controls');

        if (host.parentElement !== targetBlurb) {
            targetBlurb.prepend(host);
        }

        return () => {
            host.remove();
        };
    }, [targetBlurb]);

    return createPortal(children, portalNodeRef.current, portalKey);
}

/**
 * Renders controls portals for each visible work/bookmark blurb on the page.
 *
 * @returns Fragment containing one portal per blurb.
 * @remarks Queries the document for `li.work` and `li.bookmark` each render.
 */
export const BlurbPortals = () => {
    const blurbs = Array.from(document.querySelectorAll('li.work, li.bookmark'));

    return (
        <>
            {blurbs.map(workEl => (
                <DynamicPortal targetBlurb={workEl} portalKey={workEl.id} key={workEl.id}>
                    <BlurbPanelContent targetBlurb={workEl} workId={workEl.id.split('_')[1]} />
                </DynamicPortal>
            ))}
        </>
    );
};