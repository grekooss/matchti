/**
 * Formularz rejestracji
 */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../lib/zustand/authStore';
import { signUpSchema, type SignUpForm as SignUpFormType } from '../../lib/validation/auth';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onSwitchToSignIn,
}) => {
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormType) => {
    clearError();
    
    const result = await signUp(data);
    
    if (!result.error) {
      Alert.alert(
        'Rejestracja pomyślna',
        'Sprawdź swoją skrzynkę e-mail w celu potwierdzenia konta.',
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
        <Text className="text-3xl font-bold text-center mb-8 text-gray-900">
          Załóż konto
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
                autoComplete="new-password"
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

        {/* Pole potwierdzenia hasła */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Potwierdź hasło
          </Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-lg px-4 py-3 text-base ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="potwierdź hasło"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="new-password"
                editable={!isLoading}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
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

        {/* Przycisk rejestracji */}
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
            {isLoading ? 'Rejestrowanie...' : 'Załóż konto'}
          </Text>
        </TouchableOpacity>

        {/* Link do logowania */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">
            Masz już konto?{' '}
          </Text>
          <TouchableOpacity onPress={onSwitchToSignIn} disabled={isLoading}>
            <Text className="text-blue-600 font-semibold">
              Zaloguj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};