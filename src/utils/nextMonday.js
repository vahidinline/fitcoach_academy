export function getTimeUntilNextMonday() {
  const now = new Date();
  const day = now.getDay(); // Monday = 1

  // چند روز تا دوشنبه بعدی؟
  let daysUntilMonday = (1 - day + 7) % 7;

  // اگر امروز دوشنبه است اما بعد از ساعت ۲۴ نیست → دوشنبه بعدی
  if (daysUntilMonday === 0) {
    daysUntilMonday = 7;
  }

  const nextMonday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntilMonday,
    0, // 00:00 Monday
    0,
    0
  );

  const diffMs = nextMonday - now;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return { diffDays, diffHours, diffMinutes };
}
