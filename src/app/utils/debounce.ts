// debounce helper for scroll events etc
export function debounce(func: Function, timeout: number) {
  let timer: any;
  if (!timeout) {
    timeout = 16;
  }
  return function () {
    // @ts-expect-error an unknown 'this' is acceptable here
    const ctx: unknown = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(ctx, args);
    }, timeout);
  };
}
