
export function removeMutedWarning() {
  const warning = document.querySelector('.muted, .notice');
  if (warning) {
    warning.remove();
  }
}