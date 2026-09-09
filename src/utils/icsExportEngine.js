/**
 * iCalendar (.ics) RFC 5545 Standard Export Generator
 * Exports timetable schedule blocks into standard .ics format for Google Calendar, Apple Calendar, and Outlook.
 */

export const generateICS = (schedule = [], subjects = []) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AcademiaSync//Study Timetable Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  schedule.forEach(block => {
    if (block.status === 'reclaimed') return;

    const subject = subjects.find(s => s.id === block.subjectId);
    const subjName = subject ? subject.name : 'Study Block';

    // Format date string YYYYMMDD
    const dateFormatted = block.date.replace(/-/g, '');
    const startTimeStr = block.startTime ? block.startTime.replace(':', '') + '00' : '090000';
    const endTimeStr = block.endTime ? block.endTime.replace(':', '') + '00' : '103000';

    const dtStart = `${dateFormatted}T${startTimeStr}`;
    const dtEnd = `${dateFormatted}T${endTimeStr}`;
    const uid = `block-${block.id}-${dateFormatted}@academiasync.local`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dateFormatted}T000000Z`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${block.title} (${subjName})`);
    lines.push(`DESCRIPTION:Scheduled via AcademiaSync. Subject: ${subjName}. Type: ${block.type}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};

export const downloadICSFile = (schedule = [], subjects = []) => {
  const content = generateICS(schedule, subjects);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `AcademiaSync_Schedule_${new Date().toISOString().slice(0, 10)}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
