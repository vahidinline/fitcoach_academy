import ContextualHeader from 'components/ui/ContextualHeader';
import React from 'react';
import CertificateForm from './Request-for-cert';
import CertTemp from '../../../assets/img/CertTemplate.png';
import CertParticipate from '../../../assets/img/certParticipate.png';

function SelectCert({ clientId, handleSelect, type }) {
  const [status, setStatus] = React.useState('idle'); // idle | loading | success | error

  const certificates = [
    {
      name: 'گواهی تغذیه (Nutrition Certificate)',
      description:
        'مدرک معتبر تغذیه که از اروپا صادر شده و نشان‌دهنده تخصص شما در زمینه تغذیه است. با قابلیت استعلام از سایت اصلی صادرکننده مدرک',
      priceIRR: '۵ میلیون تومان',
      priceEUR: '۵۰ یورو',
      img: CertTemp,
      type: 'nutrition',
      features: [
        'صدور گواهی از اروپا',
        'قابلیت استعلام آنلاین',
        'مورد تایید مراکز بین‌المللی',
      ],
    },
    {
      name: 'گواهی شرکت در دوره',
      description:
        'گواهی شرکت در دوره که نشان می‌دهد شما در دوره‌های آموزشی ما حضور داشته‌اید. این مدرک به فارسی صادر میشود',
      priceIRR: '۱ میلیون تومان',
      priceEUR: '۱۰ یورو',
      img: CertParticipate,
      type: 'participation',
      features: ['صدور گواهی به زبان فارسی', 'مناسب برای ارائه به مراکز داخلی'],
    },
  ];

  return (
    <div dir="rtl" className="w-full">
      <div className="min-h-screen bg-background">
        <ContextualHeader />
        {!type ? (
          <div className="flex flex-col ">
            <div className="card-title text-gray-500">
              <h2 style={{ textAlign: 'center' }}>
                لطفا نوع گواهی مورد نظر خود را انتخاب کنید
              </h2>
            </div>

            <div className="flex lg:flex-row flex-col mt-6 gap-2 ">
              {certificates.map((item, index) => (
                <div key={index} className="card bg-base-100 w-1/2  shadow-sm">
                  <figure>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="object-fit w-1/2 "
                    />
                  </figure>
                  <div className="card-body border-t">
                    <h2 className="card-title">{item.name}</h2>
                    <p className="text-right">{item.description}</p>
                    <div className="my-2">
                      <p>
                        <strong>هزینه:</strong> {item.priceIRR} ({item.priceEUR}
                        )
                      </p>
                    </div>
                    <div className="my-2">
                      <strong>ویژگی‌ها:</strong>
                      <ul className="list-disc list-inside text-right">
                        {item.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <button
                        onClick={() => handleSelect(item.type)}
                        className="btn btn-primary w-full">
                        انتخاب گواهی
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
