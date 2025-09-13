/**
 * Przyciski autoryzacji społecznościowej (Google, Apple)
 */
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useAuthStore } from '../../lib/zustand/authStore';

interface SocialAuthButtonsProps {
  onSuccess?: () => void;
  mode?: 'signin' | 'signup';
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSuccess,
  mode = 'signin',
}) => {
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } = useAuthStore();

  const handleGoogleAuth = async () => {
    clearError();
    const result = await signInWithGoogle();
    if (!result.error) {
      onSuccess?.();
    }
  };

  const handleAppleAuth = async () => {
    clearError();
    const result = await signInWithApple();
    if (!result.error) {
      onSuccess?.();
    }
  };

  const actionText = mode === 'signin' ? 'Zaloguj się' : 'Zarejestruj się';

  return (
    <View className="w-full">
      {/* Separator */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500 text-sm">
          lub
        </Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Komunikat błędu dla autoryzacji społecznościowej */}
      {error && (
        <View className="mb-4 p-3 bg-red-50 rounded-lg">
          <Text className="text-red-700 text-center">
            {error}
          </Text>
        </View>
      )}

      {/* Przycisk Google */}
      <TouchableOpacity
        onPress={handleGoogleAuth}
        disabled={isLoading}
        className={`flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg mb-3 ${
          isLoading ? 'bg-gray-100' : 'bg-white active:bg-gray-50'
        }`}
      >
        <View className="w-5 h-5 mr-3">
          {/* Tutaj można dodać ikonę Google */}
          <Text className="text-center text-lg">G</Text>
        </View>
        <Text className="text-gray-700 font-medium">
          {actionText} przez Google
        </Text>
      </TouchableOpacity>

      {/* Przycisk Apple (tylko na iOS) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={handleAppleAuth}
          disabled={isLoading}
          className={`flex-row items-center justify-center py-3 px-4 bg-black rounded-lg ${
            isLoading ? 'opacity-50' : 'active:bg-gray-800'
          }`}
        >
          <View className="w-5 h-5 mr-3">
            {/* Tutaj można dodać ikonę Apple */}
            <Text className="text-center text-lg text-white">🍎</Text>
          </View>
          <Text className="text-white font-medium">
            {actionText} przez Apple
          </Text>
        </TouchableOpacity>
      )}

      {/* Informacja o prywatności */}
      <Text className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
        {mode === 'signup' 
          ? 'Rejestrując się, akceptujesz nasze Warunki korzystania z usługi i Politykę prywatności.'
          : 'Logując się, akceptujesz nasze Warunki korzystania z usługi i Politykę prywatności.'
        }
      </Text>
    </View>
  );
};