import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const AuthFooter = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/registration-stepper');
  };

  const handleForgotPassword = () => {
    // In a real app, this would open a forgot password modal or navigate to reset page
    alert('Forgot password functionality will be implemented with email recovery system');
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Don't have an account?
        </p>
        <Button
          variant="outline"
          fullWidth
          onClick={handleRegisterClick}
          iconName="UserPlus"
          iconPosition="left"
        >
          Create New Account
        </Button>
      </div>

      {/* Forgot Password */}
      <div className="text-center">
        <button
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 animate-spring underline"
        >
          Forgot your password?
        </button>
      </div>

      {/* Additional Info */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthFooter;