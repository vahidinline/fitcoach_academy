import React from 'react';
import { BrowserRouter, Navigate, Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import AuthenticationGuard from 'components/ui/AuthenticationGuard';
// Add your imports here

import UserDashboard from 'pages/user-dashboard';
import RegistrationStepper from 'pages/registration-stepper';
import ProgressReportSubmission from 'pages/progress-report-submission';
import TrainingVideoPlayer from 'pages/training-video-player';
import PaymentProcessing from 'pages/payment-processing';
import NotFound from 'pages/NotFound';
import BasicForm from 'pages/user-basic-data';
import CallbackRial from 'pages/Callback';
import LoginIndex from 'pages/login';
import PaymentResult from 'pages/payment-processing/components/PaymentResult';
import EditReportPage from 'pages/progress-report-submission/components/EditReport';
import { academyFeatures } from 'config/features';

const CertificateIndex = React.lazy(() => import('pages/Certificate'));
const Quiz = React.lazy(() => import('pages/Quiz'));
const PaymentHistory = React.lazy(() => import('components/PaymentHistory'));
const DietPlan = React.lazy(() => import('pages/diet-plan'));

const featureRoute = (enabled, element) =>
  enabled ? element : <Navigate to="/user-dashboard" replace />;

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthenticationGuard>
          <ScrollToTop />
          <React.Suspense fallback={null}>
          <RouterRoutes>
            {/* Define your routes here */}
            <Route path="/" element={<LoginIndex />} />
            <Route path="/quiz" element={featureRoute(academyFeatures.courseQuiz, <Quiz />)} />
            <Route path="/callback" element={<CallbackRial />} />
            <Route path="/login" element={<LoginIndex />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/register" element={<RegistrationStepper />} />
            <Route path="/payment/result" element={<PaymentResult />} />

            <Route
              path="/progress-report-submission"
              element={<ProgressReportSubmission />}
            />
            <Route path="/edit-report/:id" element={<EditReportPage />} />
            <Route
              path="/training-video-player/:videoId"
              element={<TrainingVideoPlayer />}
            />

            <Route
              path="/training-video-player"
              element={<TrainingVideoPlayer />}
            />
            <Route path="/user-basic-data" element={<BasicForm />} />
            <Route path="/diet-plan" element={<DietPlan />} />
            <Route path="/request-for-certificate" element={featureRoute(academyFeatures.courseCertificate, <CertificateIndex />)} />
            <Route path="/payment-processing" element={<PaymentProcessing />} />
            <Route path="/payment-history" element={featureRoute(academyFeatures.paymentHistory, <PaymentHistory />)} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
          </React.Suspense>
        </AuthenticationGuard>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
