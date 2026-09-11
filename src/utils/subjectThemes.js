/**
 * Subject Color Palette & Theme Engine
 * Provides predefined color tokens, priority badges, and visual tags for academic courses.
 */

export const SUBJECT_PALETTES = [
  { name: 'Indigo Core', primary: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  { name: 'Emerald STEM', primary: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { name: 'Amber Physics', primary: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { name: 'Rose Humanities', primary: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  { name: 'Purple Computing', primary: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  { name: 'Cyan Lab', primary: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' }
];

export const getSubjectStyle = (subject) => {
  const color = subject?.color || '#6366f1';
  return {
    color,
    backgroundColor: `${color}20`,
    borderColor: `${color}40`
  };
};
