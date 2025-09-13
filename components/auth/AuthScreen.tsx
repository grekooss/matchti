/**
 * Główny ekran autoryzacji z przełączaniem między formularzami
 */
import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SocialAuthButtons } from './SocialAuthButtons';

type AuthMode = 'signin' | 'signup' | 'reset-password';

interface AuthScreenProps {
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleAuthSuccess = () => {
    onAuthSuccess?.();
  };

  const handleSwitchToSignIn = () => {
    setMode('signin');
  };

  const handleSwitchToSignUp = () => {
    setMode('signup');
  };

  const handleSwitchToResetPassword = () => {
    setMode('reset-password');
  };

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <View className="flex-1">
            <SignInForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignUp={handleSwitchToSignUp}
              onForgotPassword={handleSwitchToResetPassword}
            />
            <View className="px-6 pb-8">
              <SocialAuthButtons
                mode="signin"
                onSuccess={handleAuthSuccess}
              />
            </View>
          </View>
        );

      case 'signup':
        return (
          <View className="flex-1">
            <SignUpForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignIn={handleSwitchToSignIn}
            />
            <View className="px-6 pb-8">
              <SocialAuthButtons
                mode="signup"
                onSuccess={handleAuthSuccess}
              />
            </View>
          </View>
        );

      case 'reset-password':
        return (
          <ResetPasswordForm
            onSuccess={handleSwitchToSignIn}
            onBackToSignIn={handleSwitchToSignIn}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {renderForm()}
    </SafeAreaView>
  );
};