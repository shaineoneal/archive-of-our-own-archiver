export function wrap(el: Element, wrapper: Element) {
  el.parentNode!.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}
