/**
 * Adds or removes the 'read-work' class to/from the given work element based on the boolean value.
 *
 * @param {Boolean} tf - A boolean value indicating whether the work should be marked as read.
 * @param {Element} work - The work element to be modified.
 */
export function looksRead(tf: Boolean, work: Element) {
    if (tf) work.classList.add('read-work');
    else work.classList.remove('read-work');
}