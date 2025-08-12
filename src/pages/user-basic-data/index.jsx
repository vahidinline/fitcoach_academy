import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import ContextualHeader from 'components/ui/ContextualHeader';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import { useEffect, useState, useRef } from 'react';

export default function BasicForm() {
  const [status, setStatus] = useState('idle'); // idle, loading, loaded, success, error
  const [name, setName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    userId: '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    illness: '',
    medication: '',
    pain: '',
    reason: '',
    calorie: '',
    calories: '',
    macro: '',
    lastTimeDiet: '',
    currentDiet: '',
    exerciseType: '',
    placeOfExercise: '',
    comment: '',
  });

  const formRef = useRef(null);

  // Persian labels for fields
  const fieldLabels = {
    userId: 'شناسه کاربر',
    weight: 'وزن فعلی (کیلوگرم)',
    height: 'قد (سانتی‌متر)',
    age: 'سن',
    gender: 'جنسیت',
    illness: 'بیماری خاص',
    medication: 'داروی خاص',
    pain: 'محل درد',
    reason: 'دلیل شرکت در دوره',
    calorie: 'آشنایی با کالری',
    calories: 'میزان کالری مصرفی',
    macro: 'آشنایی با ماکرو',
    lastTimeDiet: 'آخرین رژیم',
    currentDiet: 'رژیم فعلی',
    exerciseType: 'نوع ورزش',
    placeOfExercise: 'محل ورزش',
    comment: 'توضیحات',
  };

  const optionList = {
    gender: [
      { label: 'انتخاب کنید', value: '' },
      { label: 'آقا', value: 'آقا' },
      { label: 'خانم', value: 'خانم' },
    ],
    reason: [
      { label: 'انتخاب کنید', value: '' },
      { label: 'کاهش وزن', value: 'کاهش وزن' },
      { label: 'افزایش وزن', value: 'افزایش وزن' },
      { label: 'اصلاح تغذیه', value: 'اصلاح تغذیه' },
    ],
    calorie: [
      { label: 'انتخاب کنید', value: '' },
      { label: 'نمیدونم', value: 'نمیدونم' },
      { label: 'میدونم', value: 'میدونم' },
    ],
    calories: [
      { label: 'انتخاب کنید', value: '' },
      { label: 'نمیدونم', value: 'نمیدونم' },
      { label: 'زیر ۱۰۰۰', value: 'زیر ۱۰۰۰' },
      { label: '۱۰۰۰-۱۵۰۰', value: '۱۰۰۰-۱۵۰۰' },
      { label: '۱۵۰۰-۲۰۰۰', value: '۱۵۰۰-۲۰۰۰' },
      { label: 'بیشتر از ۲۰۰۰', value: 'بیشتر از ۲۰۰۰' },
    ],
    macro: [
      { label: 'نمیدونم', value: 'نمیدونم' },
      { label: 'میدونم', value: 'میدونم' },
    ],
    lastTimeDiet: [
      { label: 'انتخاب کنید', value: '' },
      { label: '۱ ماه پیش', value: '۱ ماه پیش' },
      { label: '۳ ماه پیش', value: '۳ ماه پیش' },
      { label: '۶ ماه پیش', value: '۶ ماه پیش' },
      { label: 'همیشه', value: 'همیشه' },
    ],
    exerciseType: [
      { label: 'انتخاب کنید', value: '' },
      { label: 'ورزش نمیکنم', value: 'ورزش نمیکنم' },
      { label: 'قدرتی', value: 'قدرتی' },
      { label: 'شنا', value: 'شنا' },
      { label: 'یوگا', value: 'یوگا' },
      { label: 'رزمی', value: 'رزمی' },
      { label: 'کشتی', value: 'کشتی' },
      { label: 'دو', value: 'دو' },
      { label: 'سایر', value: 'سایر' },
    ],
    placeOfExercise: [
      { label: 'انتخاب کنید', value: '' },
      { label: 'ورزش نمیکنم', value: 'ورزش نمیکنم' },
      { label: 'خانه', value: 'خانه' },
      { label: 'باشگاه', value: 'باشگاه' },
      { label: 'هر دو', value: 'هر دو' },
    ],
  };

  useEffect(() => {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const parsedCredentials = JSON.parse(credentials);
      setUserData((prev) => ({ ...prev, userId: parsedCredentials.userId }));
      setName(parsedCredentials.name || '');
      setStatus('loading');

      api
        .get(`/ShapeUpAssessment/${parsedCredentials.userId}`)
        .then((res) => {
          if (res.data?.data) {
            setUserData((prev) => ({ ...prev, ...res.data.data }));
          }
          setStatus('loaded');
        })
        .catch(() => setStatus('idle'));
    }
  }, []);

  // handleChange for both Input and Select
  const handleChange = (e) => {
    const id = e.target.id || e.target.name;
    const value = e.target.value;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post(`/ShapeUpAssessment`, userData);
      setStatus('success');
      alert('اطلاعات با موفقیت ثبت شد');
      setEditMode(false);
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />
      <div className="font-custom1 max-w-2xl mx-auto mt-6 pt-20 p-2 border rounded-lg shadow-md bg-white">
        <div dir="rtl" className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-right">
            {name ? `اطلاعات ${name}` : 'اطلاعات کاربر'}
          </h2>
          <button
            className={`px-4 py-2 rounded ${
              editMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}
            onClick={() => {
              if (editMode) {
                formRef.current?.requestSubmit(); // programmatic submit
              } else {
                setEditMode(true);
                setStatus('idle'); // reset status when entering edit mode
              }
            }}
            disabled={status === 'loading'}
            type="button">
            {editMode ? 'ثبت' : 'ویرایش'}
          </button>
        </div>

        {!editMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            {Object.entries(userData).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded shadow-sm">
                <span className="block font-semibold">
                  {fieldLabels[key] || key}:
                </span>
                <span>{value || '—'}</span>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
            <Input
              label={fieldLabels.weight}
              id="weight"
              type="text"
              onChange={handleChange}
              value={userData.weight || ''}
            />
            <Input
              label={fieldLabels.height}
              id="height"
              type="text"
              onChange={handleChange}
              value={userData.height || ''}
            />
            <Input
              label={fieldLabels.age}
              id="age"
              type="text"
              onChange={handleChange}
              value={userData.age || ''}
            />
            <Select
              label={fieldLabels.gender}
              id="gender"
              name="gender"
              onChange={handleChange}
              value={userData.gender || ''}
              options={optionList.gender}
            />
            <Input
              label={fieldLabels.illness}
              id="illness"
              type="text"
              onChange={handleChange}
              value={userData.illness || ''}
            />
            <Input
              label={fieldLabels.medication}
              id="medication"
              type="text"
              onChange={handleChange}
              value={userData.medication || ''}
            />
            <Input
              label={fieldLabels.pain}
              id="pain"
              type="text"
              onChange={handleChange}
              value={userData.pain || ''}
            />
            <Select
              label={fieldLabels.reason}
              id="reason"
              name="reason"
              onChange={handleChange}
              value={userData.reason || ''}
              options={optionList.reason}
            />
            <Select
              label={fieldLabels.calorie}
              id="calorie"
              name="calorie"
              onChange={handleChange}
              value={userData.calorie || ''}
              options={optionList.calorie}
            />
            <Select
              label={fieldLabels.calories}
              id="calories"
              name="calories"
              onChange={handleChange}
              value={userData.calories || ''}
              options={optionList.calories}
            />
            <Select
              label={fieldLabels.macro}
              id="macro"
              name="macro"
              onChange={handleChange}
              value={userData.macro || ''}
              options={optionList.macro}
            />
            <Select
              label={fieldLabels.lastTimeDiet}
              id="lastTimeDiet"
              name="lastTimeDiet"
              onChange={handleChange}
              value={userData.lastTimeDiet || ''}
              options={optionList.lastTimeDiet}
            />
            <Input
              label={fieldLabels.currentDiet}
              id="currentDiet"
              type="text"
              onChange={handleChange}
              value={userData.currentDiet || ''}
            />
            <Select
              label={fieldLabels.exerciseType}
              id="exerciseType"
              name="exerciseType"
              onChange={handleChange}
              value={userData.exerciseType || ''}
              options={optionList.exerciseType}
            />
            <Select
              label={fieldLabels.placeOfExercise}
              id="placeOfExercise"
              name="placeOfExercise"
              onChange={handleChange}
              value={userData.placeOfExercise || ''}
              options={optionList.placeOfExercise}
            />
            <Input
              label={fieldLabels.comment}
              id="comment"
              type="text"
              onChange={handleChange}
              value={userData.comment || ''}
            />
            {/* Hidden submit button to allow programmatic submission */}
            <button type="submit" className="hidden" />
          </form>
        )}
      </div>
      <BottomTabNavigation />
    </div>
  );
}
