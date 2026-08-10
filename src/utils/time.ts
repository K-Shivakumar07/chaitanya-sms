export const formatTime12 = (time: string): string => {
  const [hStr, mStr] = (time ?? '').split(':');
  const h = Number(hStr);
  const m = Number(mStr ?? 0);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
};

export const formatRange12 = (start: string, end: string): string =>
  `${formatTime12(start)} - ${formatTime12(end)}`;
