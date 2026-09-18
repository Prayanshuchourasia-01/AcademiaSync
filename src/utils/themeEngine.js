/**
 * Dynamic Application Theme Engine
 * Manages color schemes (Dark Midnight, OLED Black, Sepia Focus, Cyberpunk Neon).
 */

export const THEMES = {
  MIDNIGHT: 'theme-midnight',
  OLED: 'theme-oled',
  SEPIA: 'theme-sepia',
  CYBER: 'theme-cyber'
};

export const applyTheme = (themeName) => {
  const root = document.documentElement;
  root.classList.remove(...Object.values(THEMES));
  root.classList.add(themeName);
  localStorage.setItem('academia_theme', themeName);
};

export const getSavedTheme = () => {
  return localStorage.getItem('academia_theme') || THEMES.MIDNIGHT;
};
