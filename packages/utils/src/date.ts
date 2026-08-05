export function formatDateISO(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
