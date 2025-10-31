import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import Input from 'components/ui/Input';
import React, { useState } from 'react';

function AssessmentForm({
  userData,
  fieldLabels,
  handleChange,
  handleSubmitAssessment,
  hiddenFields,
  editMode,
  setEditMode,
  docExists,
  status,
  formRef,
  initialName,
}) {
  const [activeTab, setActiveTab] = useState('assessment');
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto pt-20 p-4 bg-white rounded-lg shadow-md font-custom1">
        {/* --- Conditional Tabs --- */}
        {activeTab === 'profile' ? (
          // 🔹 Profile Tab
          <form
            onSubmit={handleSubmitProfile}
            dir="rtl"
            className="space-y-4 mt-4">
            <div className="flex justify-between bg-green-200 p-2 rounded">
              <h2 className="font-bold text-lg">پروفایل کاربر</h2>
              <button
                type="button"
                onClick={() => {
                  if (profileEditMode) {
                    document.activeElement.blur();
                    const form = document.querySelector('form');
                    form.requestSubmit();
                  } else setProfileEditMode(true);
                }}
                disabled={profileStatus === 'loading'}
                className={`px-4 py-2 rounded ${
                  profileEditMode
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                {profileEditMode
                  ? 'ثبت'
                  : profileExists
                  ? 'ویرایش'
                  : 'ایجاد پروفایل'}
              </button>
            </div>

            {!profileEditMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 mt-3">
                {Object.entries(profileData)
                  .filter(([key]) => !['_id', 'id', 'userId'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded shadow-sm">
                      <span className="block font-semibold">
                        {fieldLabels[key] || key}:
                      </span>
                      {key === 'photo' && value ? (
                        <img
                          src={value}
                          alt="User"
                          className="w-24 h-24 rounded-full object-cover mt-1"
                        />
                      ) : (
                        <span>{value || '—'}</span>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <>
                <Input
                  label={fieldLabels.name}
                  id="name"
                  value={profileData.name}
                  onChange={handleChange}
                />
                <Input
                  label={fieldLabels.email}
                  id="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
                <Input
                  label={fieldLabels.phone}
                  id="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
                <Input
                  label={fieldLabels.location}
                  id="location"
                  value={profileData.location}
                  onChange={handleChange}
                />
                <Input
                  label={fieldLabels.instagram}
                  id="instagram"
                  value={profileData.instagram}
                  onChange={handleChange}
                />
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">
                    {fieldLabels.photo}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) =>
                          handleChange({
                            target: { id: 'photo', value: ev.target?.result },
                          });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {profileData.photo && (
                    <img
                      src={profileData.photo}
                      alt="preview"
                      className="w-24 h-24 mt-2 rounded-full object-cover"
                    />
                  )}
                </div>
                <button type="submit" className="hidden" />
              </>
            )}
          </form>
        ) : (
          // 🔹 Assessment Tab (your full original content)
          <form
            dir="rtl"
            onSubmit={handleSubmitAssessment}
            className="space-y-4 mt-4"
            ref={formRef}>
            <div className="flex justify-between bg-green-200 p-2 rounded">
              <h2 className="font-bold text-lg">
                {initialName ? `اطلاعات ${initialName}` : 'اطلاعات کاربر'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (editMode) {
                    formRef.current?.requestSubmit();
                  } else {
                    setEditMode(true);
                    setStatus('idle');
                  }
                }}
                disabled={status === 'loading'}
                className={`px-4 py-2 rounded ${
                  editMode
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                {editMode ? 'ثبت' : docExists ? 'ویرایش' : 'ایجاد اطلاعات'}
              </button>
            </div>

            {!editMode ? (
              <div className="space-y-3 mt-4">
                <div className="text-sm text-gray-500 mb-2">
                  آخرین به‌روزرسانی: {userData.updatedAt || '—'}
                </div>
                {!docExists ? (
                  <div dir="rtl" className="p-3 bg-yellow-50 rounded">
                    اطلاعاتی برای این کاربر پیدا نشد — برای ایجاد اطلاعات روی
                    "ایجاد اطلاعات" کلیک کنید.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                    {Object.entries(userData)
                      .filter(([key]) => !hiddenFields.includes(key))
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-50 p-3 rounded shadow-sm">
                          <span className="block font-semibold">
                            {fieldLabels[key] || key}:
                          </span>
                          <span>{value || '—'}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 🧩 keep all your original inputs and selects here */}
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
                {/* ... rest of your fields unchanged ... */}
                <button type="submit" className="hidden" />
              </>
            )}
          </form>
        )}
      </div>

      <BottomTabNavigation />
    </div>
  );
}

export default AssessmentForm;
