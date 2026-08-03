export function canSubmitToday(date = new Date()) {
  return date.getDay() === 1;
}

export function getNextMondayStart(date = new Date()) {
  const nextMonday = new Date(date);
  const daysUntilMonday = (8 - date.getDay()) % 7 || 7;
  nextMonday.setDate(date.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
}
