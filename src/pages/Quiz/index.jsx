import api from 'api/api';
import { useEffect, useState } from 'react';

export default function Quiz({}) {
  const [answers, setAnswers] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);
  const userId = '22323';

  const quiz = [
    // جلسه 1
    {
      question: 'کدام یک از موارد زیر در کالری خروجی وجود ندارد؟ ',
      options: ['BMR', 'کالری نقصان ', 'Neat'],
      correctAnswer: 1,
      videoId: '1',
      videoTitle: 'جلسه اول آکادمی ',
    },
    {
      question: 'میانگین قدم های یک فرد بالغ چقدر هست؟ \n',
      options: ['1000', '2000', '4000-5000', '8000-10000'],
      correctAnswer: 3,
      videoId: '1',
      videoTitle: 'جلسه اول آکادمی ',
    },
    {
      question: 'برای کاهش وزن باید در ….. باشیم \n',
      options: ['کالری تثبیت\n', 'کالری مازاد\n', 'کالری نقصان\n'],
      correctAnswer: 2,
      videoId: '1',
      videoTitle: 'جلسه اول آکادمی ',
    },
    {
      question:
        'بعد از متابولیسم پایه کدام مورد بیشترین سهم  در کالری خروجی را دارد ؟ \n',
      options: ['اثر گرمایی غذاها TEF\n', 'ورزش کردن\n', 'پیاده روی کردن'],
      correctAnswer: 2,
      videoId: '1',
      videoTitle: 'جلسه اول آکادمی ',
    },

    // جلسه 2
    {
      question: 'میزان دریافت پروتیین هر شخص بر چه اساسی مشخص می‌شود؟',
      options: ['قد شخص', 'وزن SMM شخص', 'BMI فرد', 'سن شخص'],
      correctAnswer: 1,
      videoId: '2',
      videoTitle: 'جلسه دوم',
    },
    {
      question: 'میزان استاندارد پروتئین روزانه چقدر است؟',
      options: [
        '۱/۶ تا ۲/۲ گرم به ازای هر کیلو وزن بدن',
        'دو برابر وزن',
        'یک برابر وزن',
        '۵ گرم به ازای هر کیلو وزن بدن',
      ],
      correctAnswer: 0,
      videoId: '2',
      videoTitle: 'جلسه دوم',
    },
    {
      question: 'کدام نوع پروتیین ارجح تر است؟',
      options: [
        'پروتئین گیاهی',
        'پروتئین حیوانی',
        'هیچ فرقی ندارد',
        'پودر پروتئین',
      ],
      correctAnswer: 1,
      videoId: '2',
      videoTitle: 'جلسه دوم',
    },
    {
      question: 'دلیل تنوع دادن به منابع غذایی چیست؟',
      options: [
        'افزایش میروبایوم های مفید روده',
        'جلوگیری از دلزدگی و خستگی در رژیم',
        'دریافت ویتامین ها و مینرال ها از منابع مختلف',
        'همه ی موارد بالا',
      ],
      correctAnswer: 3,
      videoId: '2',
      videoTitle: 'جلسه دوم',
    },

    // جلسه 3
    {
      question: 'کدام یک از مواد غذایی زیر منبع غنی فیبر است؟',
      options: ['نان لواش', 'برنج سفید', 'حبوبات', 'ماکارونی'],
      correctAnswer: 2,
      videoId: '3',
      videoTitle: 'جلسه سوم',
    },
    {
      question: 'چرا مصرف بیش از حد فیبر ممکن است مضر باشد؟',
      options: [
        'کاهش وزن شدید',
        'کمبود ویتامین‌ها و مواد معدنی',
        'افزایش قند خون',
        'احساس خستگی زیاد',
      ],
      correctAnswer: 1,
      videoId: '3',
      videoTitle: 'جلسه سوم',
    },
    {
      question:
        'مصرف فیبر کافی می‌تواند به کاهش خطر کدام یک از بیماری‌های زیر کمک کند؟',
      options: ['کلسترول و قند خون', 'مشکلات قلبی', 'نقرس', 'فشار خون بالا'],
      correctAnswer: 0,
      videoId: '3',
      videoTitle: 'جلسه سوم',
    },
    {
      question: 'چه مقدار فیبر در روز برای یک بزرگسال توصیه می‌شود؟',
      options: ['10 تا 15 گرم', '20 تا 35 گرم', '40 تا 55 گرم', '5 تا 10 گرم'],
      correctAnswer: 1,
      videoId: '3',
      videoTitle: 'جلسه سوم',
    },

    // جلسه 4
    {
      question:
        'کدام گزینه بیانگر نقش اصلی کربوهیدرات‌های پیچیده در رژیم غذایی انسان است؟',
      options: [
        'تامین انرژی سریع',
        'تنظیم قند خون',
        'افزایش چربی بدن',
        'کاهش وزن',
      ],
      correctAnswer: 1,
      videoId: '4',
      videoTitle: 'جلسه چهارم',
    },
    {
      question:
        'کدام یک از موارد زیر بیشترین تاثیر را در کاهش قند در رژیم غذایی دارد؟',
      options: [
        'حذف تمام مواد قندی',
        'مصرف بیشتر فیبر',
        'کاهش مصرف پروتئین',
        'افزایش مصرف آب',
      ],
      correctAnswer: 1,
      videoId: '4',
      videoTitle: 'جلسه چهارم',
    },
    {
      question:
        'میزان مصرف روزانه‌ی قند (قند پنهان + free sugare) برای یک فرد بالغ سالم چقدر توصیه شده است؟',
      options: ['کمتر از 45 گرم', '50 گرم', '75 گرم', '100 گرم'],
      correctAnswer: 0,
      videoId: '4',
      videoTitle: 'جلسه چهارم',
    },
    {
      question:
        'کدام یک از موارد زیر یک منبع کربوهیدرات پیچیده است که همچنین پروتئین بالایی دارد؟',
      options: ['عسل', 'سیب', 'کینوا', 'نان سبوس‌دار'],
      correctAnswer: 2,
      videoId: '4',
      videoTitle: 'جلسه چهارم',
    },

    // جلسه 5
    {
      question:
        'کدام یک از گزینه‌های زیر بیشترین تاثیر را بر کیفیت خواب شبانه دارد؟',
      options: [
        'مصرف کافئین قبل از خواب',
        'داشتن یک برنامه منظم خواب',
        'استفاده از گوشی موبایل در تختخواب',
        'خوردن وعده غذایی سنگین پیش از خواب',
      ],
      correctAnswer: 1,
      videoId: '5',
      videoTitle: 'جلسه پنجم',
    },
    {
      question: 'کدام یک از موارد زیر می‌تواند به افزایش کمیت خواب کمک کند؟',
      options: [
        'نوشیدن قهوه در عصر',
        'تنظیم درجه حرارت اتاق خواب',
        'مطالعه کتاب‌های هیجان‌انگیز قبل از خواب',
        'خوابیدن در طول روز به مدت طولانی',
      ],
      correctAnswer: 1,
      videoId: '5',
      videoTitle: 'جلسه پنجم',
    },
    {
      question: 'چه مقدار آب باید یک فرد بالغ در روز بنوشد؟',
      options: [
        '2 تا 3 لیتر',
        '1 تا 2 لیتر',
        '3 تا 4 لیتر',
        'بستگی به وزن فرد دارد',
      ],
      correctAnswer: 0,
      videoId: '5',
      videoTitle: 'جلسه پنجم',
    },
    {
      question: 'کمبود آب در بدن چه عارضه‌ای می‌تواند ایجاد کند؟',
      options: ['خستگی', 'سردرد', 'خشکی پوست', 'همه موارد'],
      correctAnswer: 3,
      videoId: '5',
      videoTitle: 'جلسه پنجم',
    },

    // جلسه 6
    {
      question:
        'کدامیک از موارد زیر یک منبع عالی برای بهره‌مندی از چربی‌های چند غیر اشباع است؟',
      options: ['روغن آفتابگردان', 'دانه چیا', 'کره گیاهی', 'روغن نارگیل'],
      correctAnswer: 1,
      videoId: '6',
      videoTitle: 'جلسه ششم',
    },
    {
      question:
        'کدامیک از اثرات زیر از فوائد مصرف چربی‌های سالم بر روی هورمون‌ها محسوب می‌شود؟',
      options: [
        'افزایش تولید هورمون کورتیزول',
        'بهبود تعادل هورمون‌های جنسی',
        'کاهش سطح هورمون انسولین',
        'افزایش هورمون‌های تیروئیدی',
      ],
      correctAnswer: 1,
      videoId: '6',
      videoTitle: 'جلسه ششم',
    },
    {
      question: 'کدام یک از گزینه‌های زیر منبع خوبی از چربی‌های سالم است؟',
      options: ['کره حیوانی', 'روغن زیتون', 'مارگارین', 'روغن نباتی'],
      correctAnswer: 1,
      videoId: '6',
      videoTitle: 'جلسه ششم',
    },
    {
      question: 'یک گرم چربی چند کالری دارد؟',
      options: ['۲ کالری', '۴ کالری', '۹ کالری', '۱۱ کالری'],
      correctAnswer: 2,
      videoId: '6',
      videoTitle: 'جلسه ششم',
    },

    // جلسه 7
    {
      question:
        'کدام ترکیب از مواد غذایی در یک بشقاب غذایی کامل و سالم بهتر است؟',
      options: [
        'مرغ کبابی، برنج قهوه‌ای، بروکلی بخارپز',
        'استیک گاو، سیب‌زمینی سرخ‌شده، هویج رنده‌شده',
        'ماهی سرخ‌شده، نان سفید، ذرت مکزیکی',
        'تخم‌مرغ آب‌پز، نان تست، خیار شور',
      ],
      correctAnswer: 0,
      videoId: '7',
      videoTitle: 'جلسه هفتم',
    },
    {
      question:
        'برای تعیین مقدار مناسب چربی در رژیم غذایی، از کدام بخش دست می‌توان استفاده کرد؟',
      options: ['نوک انگشت سبابه', 'کف دست', 'انگشت شست', 'پشت دست'],
      correctAnswer: 2,
      videoId: '7',
      videoTitle: 'جلسه هفتم',
    },
    {
      question: '"Rainbow eating یا رنگین‌کمانی خوردن" به چه معناست؟',
      options: [
        'مصرف فقط سبزیجات سبز',
        'خوردن غذاهای متنوع از تمام گروه‌های غذایی',
        'مصرف سبزیجات در رنگ‌های مختلف',
        'خوردن غذاهای شیرین',
      ],
      correctAnswer: 2,
      videoId: '7',
      videoTitle: 'جلسه هفتم',
    },
    {
      question:
        'کدام یک از گزینه‌های زیر مزیت استفاده از روش Hand-sized Portion در چیدن بشقاب غذایی است؟',
      options: [
        'ایجاد وعده‌های غذایی کم‌کالری',
        'اندازه‌گیری ساده و بدون نیاز به ترازو',
        'مصرف پروتئین',
        'خوردن غذای کمتر',
      ],
      correctAnswer: 1,
      videoId: '7',
      videoTitle: 'جلسه هفتم',
    },
  ];

  const submitQuiz = async (userId, answers) => {
    const res = await api.post(`/quiz/submit`, {
      userId,
      answers,
    });
    console.log(res);

    if (!res.ok) throw new Error(data.message || 'Failed to submit quiz');
    return data;
  };

  const handleAnswerChange = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    try {
      if (answers.length !== quiz.length) {
        setError('لطفاً به تمام سؤال‌ها پاسخ دهید.');
        return;
      }
      const data = await submitQuiz(userId, answers);
      setScore(data.score);
      setAttemptsLeft(data.attemptsLeft);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  //   if (loading) {
  //     return (
  //       <div className="text-center text-gray-600 py-10">در حال بارگذاری...</div>
  //     );
  //   }

  if (attemptsLeft === 0) {
    return (
      <div className="text-center text-red-600 py-10">
        شما حداکثر ۲ تلاش داشتید. امکان شرکت مجدد وجود ندارد.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        آزمون جلسه
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-md mb-3 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-600 p-2 rounded-md mb-3 text-sm">
          {message}
        </div>
      )}

      {quiz.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-medium text-gray-800 mb-2">
            {index + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center space-x-2 border rounded-lg p-2 cursor-pointer transition ${
                  answers[index] === i
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={i}
                  checked={answers[index] === i}
                  onChange={() => handleAnswerChange(index, i)}
                  className="accent-blue-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={attemptsLeft === 0}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl mt-4 hover:bg-blue-700 transition">
        ارسال پاسخ‌ها
      </button>

      <div className="text-sm text-gray-500 text-center mt-4">
        تلاش‌های باقیمانده: {attemptsLeft}
      </div>

      {score !== null && (
        <div className="text-center mt-4 text-lg font-semibold text-gray-700">
          امتیاز شما: {score}
        </div>
      )}
    </div>
  );
}
