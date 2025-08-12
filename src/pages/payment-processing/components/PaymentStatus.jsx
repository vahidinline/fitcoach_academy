import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentStatus = ({ status, transactionId, error, onRetry, onClose }) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/user-dashboard');
  };

  if (status === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400 p-4">
        <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Processing Payment</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Please wait while we securely process your payment. This may take a few moments.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Your payment is being processed securely</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400 p-4">
        <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your payment has been processed successfully. Welcome to FitCoach Academy!
              </p>
            </div>
            
            {transactionId && (
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-card-foreground">{transactionId}</p>
              </div>
            )}

            <div className="bg-success/10 rounded-lg p-4 text-left">
              <h4 className="font-medium text-success mb-2">What's Next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Access your personalized dashboard</li>
                <li>• Start your first training session</li>
                <li>• Track your fitness progress</li>
                <li>• Connect with your coach</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                variant="default"
                onClick={handleGoToDashboard}
                fullWidth
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                fullWidth
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400 p-4">
        <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="XCircle" size={32} className="text-destructive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Payment Failed</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We encountered an issue processing your payment. Please try again.
              </p>
            </div>
            
            {error && (
              <div className="bg-destructive/10 rounded-lg p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="bg-muted/30 rounded-lg p-4 text-left">
              <h4 className="font-medium text-card-foreground mb-2">Common Solutions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check your card details and try again</li>
                <li>• Ensure sufficient funds are available</li>
                <li>• Contact your bank if the issue persists</li>
                <li>• Try a different payment method</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                variant="default"
                onClick={onRetry}
                fullWidth
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentStatus;