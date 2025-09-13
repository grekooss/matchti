/**
 * Formularz resetowania hasła
 */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../lib/zustand/authStore';
import { resetPasswordSchema, type ResetPasswordForm as ResetPasswordFormType } from '../../lib/validation/auth';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onBackToSignIn?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSuccess,
  onBackToSignIn,
}) => {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormType) => {
    clearError();
    
    const result = await resetPassword(data);
    
    if (!result.error) {
      Alert.alert(
        'E-mail wysłany',
        'Sprawdź swoją skrzynkę e-mail w celu dalszych instrukcji resetowania hasła.',
        [{ text: 'OK', onPress: onSuccess }]
      );
      reset();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 px-6 py-8"
    >
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-center mb-4 text-gray-900">
          Resetuj hasło
        </Text>
        
        <Text className="text-gray-600 text-center mb-8">
          Wprowadź adres e-mail powiązany z Twoim kontem, a wyślemy Ci link do resetowania hasła.
        </Text>

        {/* Pole e-mail */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Adres e-mail
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-lg px-4 py-3 text-base ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="wprowadź adres e-mail"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Komunikat błędu */}
        {error && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg">
            <Text className="text-red-700 text-center">
              {error}
            </Text>
          </View>
        )}

        {/* Przycisk resetowania */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={`py-4 px-6 rounded-lg mb-4 ${
            isLoading 
              ? 'bg-gray-400' 
              : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isLoading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
          </Text>
        </TouchableOpacity>

        {/* Link powrotu do logowania */}
        <TouchableOpacity onPress={onBackToSignIn} disabled={isLoading}>
          <Text className="text-blue-600 text-center font-semibold">
            Powrót do logowania
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};