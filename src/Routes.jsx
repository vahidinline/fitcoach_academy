import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthenticationGuard>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your routes here */}
            <Route path="/" element={<LoginIndex />} />
            <Route path="/callback" element={<CallbackRial />} />
            <Route path="/login" element={<LoginIndex />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/register" element={<RegistrationStepper />} />
            <Route
              path="/progress-report-submission"
              element={<ProgressReportSubmission />}
            />
            <Route
              path="/training-video-player/:videoId"
              element={<TrainingVideoPlayer />}
            />

            <Route
              path="/training-video-player"
              element={<TrainingVideoPlayer />}
            />
            <Route path="/user-basic-data" element={<BasicForm />} />
            <Route path="/payment-processing" element={<PaymentProcessing />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </AuthenticationGuard>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
