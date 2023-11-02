
export function addToggleToBox(toggleBox: Element, innerToggles: Element[]) {
    for (let i = 0; i < innerToggles.length; i++) {
        toggleBox.appendChild(innerToggles[i]);
    }
}