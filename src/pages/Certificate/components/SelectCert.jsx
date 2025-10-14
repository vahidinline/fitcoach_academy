import ContextualHeader from 'components/ui/ContextualHeader';
import React from 'react';
import CertificateIndex from '..';
import CertificateForm from './Request-for-cert';
import CertTemp from '../../../assets/img/CertTemplate.png';
import CertParticipate from '../../../assets/img/certParticipate.png';
function SelectCert({ clientId, handleSelect, setType, type }) {
  const [status, setStatus] = React.useState('idle'); // idle | loading | success | error

  return (
    <div dir="rtl" className="l">
      <div className="min-h-screen bg-background">
        <ContextualHeader />
        {!type ? (
          <div className="pt-16 pb-20 lg:pl-64 lg:pb-0 p-5">
            <div className="card-title text-gray-500">
              <h2 style={{ textAlign: 'center' }}>
                لطفا نوع گواهی مورد نظر خود را انتخاب کنید
              </h2>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 mt-6 ">
              <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                  <img src={CertTemp} alt="nutrition certificate" />
                </figure>
                <div className="card-body border-t">
                  <h2 className="card-title">
                    گواهی تغذیه (Nutrition Certificate)
                  </h2>
                  <p className="text-right">
                    مدرک معتبر تغذیه که از اروپا صادر شده و نشان‌دهنده تخصص شما
                    در زمینه تغذیه است.
                  </p>
                  <div className="card-actions justify-between">
                    <div className="flex flex-col ">
                      <span>۵ میلیون تومان</span>
                      <span>۴۹ یورو</span>
                    </div>
                    <button
                      onClick={() => handleSelect('nutrition')}
                      className="btn btn-primary">
                      گواهی تغذیه
                    </button>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                  <img src={CertParticipate} alt="Shoes" />
                </figure>
                <div className="card-body border-t">
                  <h2 className="card-title">گواهی شرکت در دوره</h2>
                  <p className="text-right">
                    گواهی شرکت در دوره که نشان می‌دهد شما در دوره‌های آموزشی ما
                    حضور داشته‌اید.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="justify-between ">
                      <span>هزینه :</span>
                      <span>رایگان</span>
                    </div>
                    <button
                      onClick={() => handleSelect('participation')}
                      className="btn btn-primary">
                      {' '}
                      گواهی شرکت در دوره
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p>
              شما گواهی نوع <strong>{type}</strong> را انتخاب کرده‌اید.
            </p>
            <CertificateForm clientId={clientId} type={type} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectCert;
