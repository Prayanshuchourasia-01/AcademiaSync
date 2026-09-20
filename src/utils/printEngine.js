/**
 * Printable Timetable Stylesheet & HTML Generator Engine
 * Generates printer-friendly weekly study schedule layouts.
 */

export const triggerPrintSchedule = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};
