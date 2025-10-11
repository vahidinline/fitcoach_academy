// Persian translations for the application
export const translations = {
  // Login page
  login: {
    welcome: 'خوش آمدید',
    signInMessage: 'به حساب کاربری خود وارد شوید',
    appName: 'آکادمی آذر شفیعی',
    demoCredentials: 'اطلاعات ورود نمونه:',
    phone: 'تلفن: 09123456789',
    email: 'ایمیل: demo@fitcoach.com',
    phoneInternational: 'تلفن: +1234567890',
  },

  // Dashboard
  dashboard: {
    welcomeBack: 'خوش آمدید، {name}!',
    readyToContinue:
      'آماده ادامه سفر تناسب اندام هستید؟ بیایید امروز را به یادماندنی کنیم.',
    loadingDashboard: 'در حال بارگذاری داشبورد...',
    failedToLoad: 'بارگذاری اطلاعات داشبورد ناموفق بود',
    tryAgain: 'تلاش مجدد',

    // Stats
    totalWorkouts: 'کل تمرینات',
    currentStreak: 'رکورد فعلی',
    progressReports: 'گزارش‌های پیشرفت',
    nextMilestone: 'هدف بعدی',

    // Training videos
    trainingVideos: 'ویدئوهای آموزشی',
    fullBodyStrength: 'تمرین قدرتی تمام بدن',
    morningCardio: 'کاردیو صبحگاهی',
    coreStrengthening: 'تقویت عضلات مرکزی',
    flexibilityStretching: 'انعطاف پذیری و کشش',
    hiitFatBurning: 'تمرین چربی سوزی',
    upperBodyPower: 'تمرین قدرتی بالاتنه',
    legDayIntensive: 'تمرین فشرده پا',
    recoveryYoga: 'یوگای بازیابی',
    functionalMovement: 'تمرین حرکات کاربردی',
    athleticPerformance: 'تقویت عملکرد ورزشی',

    // Difficulty levels
    beginner: 'مبتدی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',

    // Progress
    progressSection: 'بخش پیشرفت',
    reviewed: 'بررسی شده',
    pending: 'در انتظار',
    needsRevision: 'نیاز به بازنگری',

    // Schedule
    upcomingSchedule: 'برنامه آینده',
    quickActions: 'اقدامات سریع',

    // Quick actions
    submitProgress: 'ثبت پیشرفت',
    watchTraining: 'مشاهده آموزش',
    viewSchedule: 'مشاهده برنامه',
    contactCoach: 'تماس با مربی',
  },

  // Common
  common: {
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    success: 'موفقیت',
    cancel: 'لغو',
    confirm: 'تأیید',
    save: 'ذخیره',
    edit: 'ویرایش',
    delete: 'حذف',
    close: 'بستن',
    back: 'بازگشت',
    next: 'بعدی',
    previous: 'قبلی',
    continue: 'ادامه',
    submit: 'ارسال',

    // Time units
    minutes: 'دقیقه',
    hours: 'ساعت',
    days: 'روز',
    weeks: 'هفته',
    months: 'ماه',

    // Status
    active: 'فعال',
    inactive: 'غیرفعال',
    completed: 'تکمیل شده',
    inProgress: 'در حال انجام',

    // Navigation
    home: 'خانه',
    dashboard: 'داشبورد',
    profile: 'پروفایل',
    settings: 'تنظیمات',
    logout: 'خروج',
  },

  // Registration stepper
  registration: {
    stepIndicator: 'مرحله {current} از {total}',
    locationSelection: 'انتخاب موقعیت',
    serviceSelection: 'انتخاب خدمات',
    authMethod: 'روش احراز هویت',
    verification: 'تأیید هویت',
    payment: 'پرداخت',
  },

  // Training video player
  videoPlayer: {
    play: 'پخش',
    pause: 'توقف',
    fullscreen: 'تمام صفحه',
    volume: 'صدا',
    settings: 'تنظیمات',
    quality: 'کیفیت',
    speed: 'سرعت',
    captions: 'زیرنویس',
  },

  // Progress report
  progressReport: {
    title: 'گزارش پیشرفت',
    measurements: 'اندازه‌گیری‌ها',
    photos: 'عکس‌ها',
    notes: 'یادداشت‌ها',
    calorieTracking: 'پیگیری کالری',
    submit: 'ارسال گزارش',
    beforePhoto: 'عکس قبل',
    afterPhoto: 'عکس بعد',
    weight: 'وزن',
    height: 'قد',
    bodyFat: 'درصد چربی بدن',
  },

  // Payment
  payment: {
    processing: 'پردازش پرداخت',
    orderSummary: 'خلاصه سفارش',
    paymentMethod: 'روش پرداخت',
    cardNumber: 'شماره کارت',
    expiryDate: 'تاریخ انقضا',
    cvv: 'کد امنیتی',
    total: 'مجموع',
    payNow: 'پرداخت',
  },
};

// Helper function to get translation with fallback
export const t = (key, params = {}) => {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }

  if (!value) return key; // Return key if translation not found

  // Replace parameters in the translation
  let result = value;
  Object.keys(params).forEach((param) => {
    result = result.replace(`{${param}}`, params[param]);
  });

  return result;
};

export default translations;
