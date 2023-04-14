export function debounce(callback: (...args: unknown[]) => void, delay = 500) {
  let timeout: NodeJS.Timeout;
  console.log("hiere?", callback);
  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log(callback, "callback function");
      callback(...args);
    }, delay);
  };
}
