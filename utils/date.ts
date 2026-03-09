export function formatDateShort(date: Date | string) {
  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(parsed);
}
