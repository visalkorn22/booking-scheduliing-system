
export const formatInTimezone = (dateStr: string, timezone: string, options: Intl.DateTimeFormatOptions) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  try {
    return date.toLocaleString([], {
      ...options,
      timeZone: timezone || 'UTC',
    });
  } catch (e) {
    return date.toLocaleString([], options);
  }
};

export const generateGoogleCalendarLink = (title: string, startIso: string, durationMinutes: number, details: string) => {
  if (!startIso) return '#';
  const startDate = new Date(startIso);
  if (isNaN(startDate.getTime())) return '#';

  const endDate = new Date(startDate.getTime() + (durationMinutes || 60) * 60000);
  
  const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const dates = `${fmt(startDate)}/${fmt(endDate)}`;
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}`;
};

export const generateOutlookCalendarLink = (title: string, startIso: string, durationMinutes: number, details: string) => {
  if (!startIso) return '#';
  const startDate = new Date(startIso);
  if (isNaN(startDate.getTime())) return '#';

  const endDate = new Date(startDate.getTime() + (durationMinutes || 60) * 60000);
  
  const start = startDate.toISOString();
  const end = endDate.toISOString();
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(details)}`;
};

export const generateICSLink = (title: string, startIso: string, durationMinutes: number, details: string) => {
  if (!startIso) return '#';
  const startDate = new Date(startIso);
  if (isNaN(startDate.getTime())) return '#';

  const endDate = new Date(startDate.getTime() + (durationMinutes || 60) * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(startDate)}`,
    `DTEND:${fmt(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
};
