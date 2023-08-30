/**
 * 节流
 * @param {*} func
 * @param {*} delay
 */
export function throttle(func, delay = 300) {
  let timer;
  return function (...args) {
    return new Promise((resolve) => {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null; 
          resolve( func.apply(this, args));
        }, delay);
      }
    });
  };
}
