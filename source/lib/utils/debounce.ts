export default function debounce<A extends any[]>(
  wait: number,
  immediate: boolean,
  cb: (...args: A) => void,
) {
  var timeoutId: number | null = null;

  return function debouncedFunction(...args: A) {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      if (!immediate) cb(...args);
    }, wait);
    if (immediate && !timeoutId) cb(...args);
  };
}
