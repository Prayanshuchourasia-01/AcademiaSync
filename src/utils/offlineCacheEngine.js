/**
 * Offline Storage & Storage Fallback Engine
 * Handles offline caching of state, network connection status monitoring, and cache synchronization.
 */

export const registerOfflineListeners = (onStatusChange) => {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => onStatusChange && onStatusChange(true);
  const handleOffline = () => onStatusChange && onStatusChange(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
