export function wrap(wrapee: Node, wrapper: Node) {
    wrapee.parentNode!.insertBefore(wrapper, wrapee);
    wrapper.appendChild(wrapee);
}