export function canSubmitToday() {
  const now = new Date();

  // 0 = Sunday, 1 = Monday, 2 = Tuesday...
  const day = now.getDay();

  // Monday = 1
  if (day !== 1) return false;

  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Allow until 23:59
  if (hours < 24) return true;

  return false;
}
