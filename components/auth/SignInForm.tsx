/**
 * Formularz logowania
 */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../lib/zustand/authStore';
import { signInSchema, type SignInForm as SignInFormType } from '../../lib/validation/auth';

interface SignInFormProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onSwitchToSignUp,
  onForgotPassword,
}) => {
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormType) => {
    clearError();
    
    const result = await signIn(data);
    
    if (!result.error) {
      reset();
      onSuccess?.();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 px-6 py-8"
    >
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-900">
          Zaloguj się
        </Text>

        {/* Pole e-mail */}
        <View className="mb-4">
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

        {/* Pole hasła */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Hasło
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-lg px-4 py-3 text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="wprowadź hasło"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="current-password"
                editable={!isLoading}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Link zapomniałem hasła */}
        <TouchableOpacity 
          onPress={onForgotPassword}
          disabled={isLoading}
          className="mb-6"
        >
          <Text className="text-blue-600 text-right">
            Zapomniałem hasła
          </Text>
        </TouchableOpacity>

        {/* Komunikat błędu */}
        {error && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg">
            <Text className="text-red-700 text-center">
              {error}
            </Text>
          </View>
        )}

        {/* Przycisk logowania */}
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
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </Text>
        </TouchableOpacity>

        {/* Link do rejestracji */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">
            Nie masz konta?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchToSignUp} disabled={isLoading}>
            <Text className="text-blue-600 font-semibold">
              Załóż konto
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};