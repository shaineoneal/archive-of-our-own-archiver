export * from './logger.ts';
export * from './wrapper.ts';

/**
 * Checks if the popup is open as a popup or as a tab.
 * Used to determine how big the popup should be.
 *
 * @see{@link https://marcomelilli.com/posts/chrome-extension-determine-if-inside-popup-or-tab/}
 */
export const isInPopup = function() {
    return (typeof chrome != undefined && chrome.extension) ?
        chrome.extension.getViews({ type: "popup" }).length > 0 : null;
}