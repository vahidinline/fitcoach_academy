import React from 'react';
import DocumentUploadPanel from './DocumentUploadPanel';
export default function LabTestUpload({ userId }) {
  return <DocumentUploadPanel userId={userId} endpoint="/report/upload-lab-test" eyebrow="پرونده سلامت" title="آزمایش‌های پزشکی" description="تصویر یا فایل PDF نتیجه آزمایش را برای نگهداری در پرونده شخصی خود بارگذاری کنید." icon="FlaskConical" />;
}
