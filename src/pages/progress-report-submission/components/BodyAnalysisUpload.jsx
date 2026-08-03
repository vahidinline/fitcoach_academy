import React from 'react';
import DocumentUploadPanel from './DocumentUploadPanel';
export default function BodyAnalysisUpload({ userId }) {
  return <DocumentUploadPanel userId={userId} endpoint="/report/upload-body-analysis" eyebrow="ترکیب بدنی" title="بادی آنالیز" description="آخرین نتیجه آنالیز ترکیب بدنی را برای مقایسه و بررسی مربی بارگذاری کنید." icon="ScanLine" />;
}
