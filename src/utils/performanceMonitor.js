/**
 * Performance & Memory Usage Monitor
 */

export const measureRenderTime = (componentName, callback) => {
  const start = performance.now();
  if (callback) callback();
  const end = performance.now();
  return (end - start).toFixed(2);
};
