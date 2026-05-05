export * from './logger.ts';
export * from './wrapper.ts';
export * from './parse.ts'

/**
 * Checks if the popup is open as a popup or as a tab.
 * Used to determine how big the popup should be.
 *
 * @see{@link https://marcomelilli.com/posts/chrome-extension-determine-if-inside-popup-or-tab/}
 */
export const isInPopup = function() {
    return (typeof chrome != "undefined" && chrome.extension) ?
        chrome.extension.getViews({ type: "popup" }).length > 0 : null;
}

export const formatDate = function(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}