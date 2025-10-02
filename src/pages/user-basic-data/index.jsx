import api from 'api/api';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import ContextualHeader from 'components/ui/ContextualHeader';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import { useEffect, useState, useRef } from 'react';

export default function BasicForm() {
  // read once from localStorage (supports either key)
  const storedCredentials = (() => {
    try {
      return JSON.parse(localStorage.getItem('credentials') || 'null');
    } catch {
      return null;
    }
  })();
  const storedUserData = (() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
      return null;
    }
  })();

  const initialUserId =
    storedCredentials?.userId ||
    storedUserData?.id ||
    storedUserData?.userId ||
    '';

  const initialName = storedCredentials?.name || storedUserData?.name || '';

  const [status, setStatus] = useState('idle'); // idle, loading, loaded, success, error
  const [name, setName] = useState(initialName);
  const [editMode, setEditMode] = useState(false);
  const [docExists, setDocExists] = useState(false);
  const hiddenFields = ['userId', '__v', 'createdAt', 'id', '_id', 'updatedAt'];
  const [userData, setUserData] = useState({
    userId: initialUserId || '',
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
    updatedAt: '',
    // if your API returns an _id or id for the document, it will be merged in on fetch
  });

  const formRef = useRef(null);

  const fieldLabels = {
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
    updatedAt: 'آخرین به‌روزرسانی',
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

  // fetch function (used on mount and after successful save)
  const fetchDoc = async (id) => {
    if (!id) return;
    setStatus('loading');
    try {
      const res = await api.get(`/ShapeUpAssessment/${id}`);
      // log the response shape to debug if needed
      // console.log('fetchDoc res', res);
      if (res.data?.data) {
        setUserData((prev) => ({ ...prev, ...res.data.data }));
        setDocExists(true);
      } else {
        // no document found
        setDocExists(false);
      }
      setStatus('loaded');
    } catch (err) {
      console.error('fetchDoc error', err);
      setDocExists(false);
      setStatus('idle');
    }
  };

  // fetch when we have userId (runs on mount if initialUserId exists)
  useEffect(() => {
    if (userData.userId) {
      fetchDoc(userData.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.userId]);

  // support both native events and custom select callbacks
  const handleChange = (eOrValue, maybeName) => {
    if (eOrValue && eOrValue.target) {
      const { id, name, value } = eOrValue.target;
      setUserData((prev) => ({ ...prev, [id || name]: value }));
    } else {
      // when Select calls onChange(value) we pass field name explicitly
      const fieldName = maybeName;
      setUserData((prev) => ({ ...prev, [fieldName]: eOrValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // if backend expects update vs create, use PUT when the document has an id/_id
      const docId = userData._id || userData.id;
      if (docId) {
        console.log('put');
        await api.put(`/ShapeUpAssessment/${docId}`, userData);
      } else {
        console.log('post');
        await api.post(`/ShapeUpAssessment`, userData);
      }

      // after save, refetch to get server-updated fields (like updatedAt)
      await fetchDoc(userData.userId);

      setStatus('success');
      alert('اطلاعات با موفقیت ثبت شد');
      setEditMode(false);
    } catch (error) {
      console.error('submit error', error);
      setStatus('error');
      alert('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader />
      <div className="font-custom1 max-w-2xl mx-auto mt-6 pt-20 p-2 border rounded-lg shadow-md bg-white">
        <div
          dir="rtl"
          className="flex relative  justify-between bg-green-200 mb-4  w-full p-2 rounded top-16 max-w-2xl">
          <h2 className="text-lg font-bold text-right">
            {name ? `اطلاعات ${name}` : 'اطلاعات کاربر'}
          </h2>
          <button
            className={`px-4 py-2 rounded ${
              editMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}
            onClick={() => {
              if (editMode) {
                formRef.current?.requestSubmit();
              } else {
                setEditMode(true);
                setStatus('idle');
              }
            }}
            disabled={status === 'loading'}
            type="button">
            {editMode ? 'ثبت' : docExists ? 'ویرایش' : 'ایجاد اطلاعات'}
          </button>
        </div>

        {!editMode ? (
          <div className="space-y-3 mt-20">
            {/* show updatedAt at top if present */}
            <div className="text-sm text-gray-500 mb-2">
              آخرین به‌روزرسانی: {formatDate(userData.updatedAt)}
            </div>

            {!docExists ? (
              <div dir="rtl" className="p-3 bg-yellow-50 rounded">
                اطلاعاتی برای این کاربر پیدا نشد — برای ایجاد اطلاعات روی "ایجاد
                اطلاعات" کلیک کنید.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                {Object.entries(userData)
                  .filter(([key]) => !hiddenFields.includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded shadow-sm">
                      <span className="block font-semibold">
                        {fieldLabels[key] || key}:
                      </span>
                      <span>
                        {key === 'updatedAt'
                          ? new Date(value).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : value || '—'}
                      </span>
                    </div>
                  ))}
                {/* {Object.entries(userData)
                  .filter(
                    ([key]) =>
                      ![
                        'userId',
                        '__v',
                        'createdAt',
                        'id',
                        '_id',
                        'updatedAt',
                      ].includes(key) // exclude unwanted fields
                  )
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded shadow-sm">
                      <span className="block font-semibold">
                        {fieldLabels[key] || key}:
                      </span>
                      <span>
                        {key === 'updatedAt' ? formatDate(value) : value || '—'}
                      </span>
                    </div>
                  ))} */}
              </div>
            )}
          </div>
        ) : (
          <form
            dir="rtl"
            onSubmit={handleSubmit}
            className="space-y-4 mt-20"
            ref={formRef}>
            <Input
              label={fieldLabels.weight}
              id="weight"
              onChange={handleChange}
              value={userData.weight || ''}
            />
            <Input
              label={fieldLabels.height}
              id="height"
              onChange={handleChange}
              value={userData.height || ''}
            />
            <Input
              label={fieldLabels.age}
              id="age"
              onChange={handleChange}
              value={userData.age || ''}
            />
            <Select
              label={fieldLabels.gender}
              name="gender"
              onChange={(v) => handleChange(v, 'gender')}
              value={userData.gender || ''}
              options={optionList.gender}
            />
            <Input
              label={fieldLabels.illness}
              id="illness"
              onChange={handleChange}
              value={userData.illness || ''}
            />
            <Input
              label={fieldLabels.medication}
              id="medication"
              onChange={handleChange}
              value={userData.medication || ''}
            />
            <Input
              label={fieldLabels.pain}
              id="pain"
              onChange={handleChange}
              value={userData.pain || ''}
            />
            <Select
              label={fieldLabels.reason}
              name="reason"
              onChange={(v) => handleChange(v, 'reason')}
              value={userData.reason || ''}
              options={optionList.reason}
            />
            <Select
              label={fieldLabels.calorie}
              name="calorie"
              onChange={(v) => handleChange(v, 'calorie')}
              value={userData.calorie || ''}
              options={optionList.calorie}
            />
            <Select
              label={fieldLabels.calories}
              name="calories"
              onChange={(v) => handleChange(v, 'calories')}
              value={userData.calories || ''}
              options={optionList.calories}
            />
            <Select
              label={fieldLabels.macro}
              name="macro"
              onChange={(v) => handleChange(v, 'macro')}
              value={userData.macro || ''}
              options={optionList.macro}
            />
            <Select
              label={fieldLabels.lastTimeDiet}
              name="lastTimeDiet"
              onChange={(v) => handleChange(v, 'lastTimeDiet')}
              value={userData.lastTimeDiet || ''}
              options={optionList.lastTimeDiet}
            />
            <Input
              label={fieldLabels.currentDiet}
              id="currentDiet"
              onChange={handleChange}
              value={userData.currentDiet || ''}
            />
            <Select
              label={fieldLabels.exerciseType}
              name="exerciseType"
              onChange={(v) => handleChange(v, 'exerciseType')}
              value={userData.exerciseType || ''}
              options={optionList.exerciseType}
            />
            <Select
              label={fieldLabels.placeOfExercise}
              name="placeOfExercise"
              onChange={(v) => handleChange(v, 'placeOfExercise')}
              value={userData.placeOfExercise || ''}
              options={optionList.placeOfExercise}
            />
            <Input
              label={fieldLabels.comment}
              id="comment"
              onChange={handleChange}
              value={userData.comment || ''}
            />
            <button type="submit" className="hidden" />
          </form>
        )}
      </div>

      <BottomTabNavigation />
    </div>
  );
}
