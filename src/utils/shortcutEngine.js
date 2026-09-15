/**
 * Keyboard Shortcuts Engine
 * Binds global hotkeys for navigation, modal triggers, and quick check-in.
 */

export const registerKeyboardShortcuts = (handlers = {}) => {
  const handleKeyDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (handlers.onNavSchedule) handlers.onNavSchedule();
    } else if (e.altKey && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      if (handlers.onNavHUD) handlers.onNavHUD();
    } else if (e.altKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      if (handlers.onNavExams) handlers.onNavExams();
    } else if (e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      if (handlers.onOpenAddBlock) handlers.onOpenAddBlock();
    } else if (e.key === '?') {
      e.preventDefault();
      if (handlers.onToggleShortcuts) handlers.onToggleShortcuts();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
};
