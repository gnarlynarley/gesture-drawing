export default function debounce<A extends any[]>(
  cb: (...args: A) => void,
  wait: number,
  immediate?: boolean,
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
