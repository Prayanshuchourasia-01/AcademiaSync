// Date utility functions with strict input validation for AcademiaSync Scheduler

export const DEFAULT_DATE = '2026-09-01';

export const formatDate = (dateInput) => {
  if (!dateInput) return DEFAULT_DATE;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return DEFAULT_DATE;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'Sep 1, 2026';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return 'Sep 1, 2026';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const addDays = (dateStr, days) => {
  const safeDate = formatDate(dateStr);
  const d = new Date(safeDate + 'T00:00:00');
  if (isNaN(d.getTime())) return DEFAULT_DATE;
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const diffInDays = (dateStr1, dateStr2) => {
  const d1 = new Date(formatDate(dateStr1) + 'T00:00:00');
  const d2 = new Date(formatDate(dateStr2) + 'T00:00:00');
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  const diffTime = d1 - d2;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getWeekDays = (referenceDateStr) => {
  const safeDate = formatDate(referenceDateStr);
  const ref = new Date(safeDate + 'T00:00:00');
  if (isNaN(ref.getTime())) return [DEFAULT_DATE];
  const dayOfWeek = ref.getDay(); // 0 is Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + mondayOffset);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(formatDate(d));
  }
  return days;
};

export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
  return parts[0] * 60 + parts[1];
};

export const minutesToTime = (totalMinutes) => {
  const safeMins = isNaN(totalMinutes) ? 0 : totalMinutes;
  const h = Math.floor(safeMins / 60) % 24;
  const m = Math.floor(safeMins % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const format12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return '';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${mStr || '00'} ${ampm}`;
};
