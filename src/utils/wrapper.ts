export function wrap(wrapee: Element, wrapper: Element) {
    wrapee.parentNode!.insertBefore(wrapper, wrapee);
    wrapper.appendChild(wrapee);
}
