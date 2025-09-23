/**
 * Ekran resetowania hasła - obsługuje ustawianie nowego hasła po kliknięciu w link z emaila
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Walidacja hasła
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Hasło jest wymagane';
    }
    if (password.length < 8) {
      return 'Hasło musi mieć co najmniej 8 znaków';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Hasło musi zawierać małą literę';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Hasło musi zawierać wielką literę';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Hasło musi zawierać cyfrę';
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return 'Hasło musi zawierać znak specjalny';
    }
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      return 'Potwierdzenie hasła jest wymagane';
    }
    if (password !== confirmPassword) {
      return 'Hasła nie są identyczne';
    }
    return '';
  };

  // Obsługa zmian w polach
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text || passwordError) {
      const error = validatePassword(text);
      setPasswordError(error);
    }
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(text, confirmPassword);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text || confirmPasswordError) {
      const error = validateConfirmPassword(password, text);
      setConfirmPasswordError(error);
    }
  };

  // Walidacja całego formularza
  const validateForm = () => {
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    return !passwordErr && !confirmPasswordErr;
  };

  // Obsługa resetowania hasła
  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        Alert.alert('Błąd', error.message);
        return;
      }

      Alert.alert(
        'Sukces',
        'Hasło zostało pomyślnie zmienione. Możesz teraz zalogować się nowym hasłem.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Błąd', 'Wystąpił nieoczekiwany błąd podczas zmiany hasła.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ustaw sesję z tokenów z URL-a
  useEffect(() => {
    const setSession = async () => {
      if (access_token && refresh_token) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });

          if (error) {
            console.error('Błąd ustawiania sesji:', error);
            Alert.alert(
              'Błąd',
              'Link resetowania hasła jest nieprawidłowy lub wygasł.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)'),
                },
              ]
            );
          }
        } catch (error) {
          console.error('Nieoczekiwany błąd ustawiania sesji:', error);
          Alert.alert(
            'Błąd',
            'Wystąpił błąd podczas przetwarzania linku resetowania.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        }
      } else {
        Alert.alert(
          'Błąd',
          'Link resetowania hasła jest nieprawidłowy.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    };

    setSession();
  }, [access_token, refresh_token, router]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Nagłówek */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#069494" />
            </TouchableOpacity>
            <Text style={styles.title}>Nowe hasło</Text>
          </View>

          <Text style={styles.subtitle}>
            Wprowadź nowe hasło dla swojego konta
          </Text>

          {/* Pole hasła */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Nowe hasło</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, passwordError && styles.passwordInputError]}
                placeholder="Wprowadź nowe hasło"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => {
                  if (password) {
                    const error = validatePassword(password);
                    setPasswordError(error);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => {
                  const newShowPassword = !showPassword;
                  setShowPassword(newShowPassword);
                  setShowConfirmPassword(newShowPassword);
                }}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            {password && !passwordError && (
              <View style={styles.passwordStrengthContainer}>
                <Text style={styles.passwordStrengthLabel}>Wymagania hasła:</Text>
                <Text style={[styles.passwordRequirement, password.length >= 8 && styles.requirementMet]}>
                  • Co najmniej 8 znaków
                </Text>
                <Text style={[styles.passwordRequirement, /(?=.*[a-z])/.test(password) && styles.requirementMet]}>
                  • Mała litera
                </Text>
                <Text style={[styles.passwordRequirement, /(?=.*[A-Z])/.test(password) && styles.requirementMet]}>
                  • Wielka litera
                </Text>
                <Text style={[styles.passwordRequirement, /(?=.*\d)/.test(password) && styles.requirementMet]}>
                  • Cyfra
                </Text>
                <Text style={[styles.passwordRequirement, /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password) && styles.requirementMet]}>
                  • Znak specjalny (!@#$%^&* itp.)
                </Text>
              </View>
            )}
          </View>

          {/* Potwierdzenie hasła */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Potwierdź nowe hasło</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, confirmPasswordError && styles.passwordInputError]}
                placeholder="Potwierdź nowe hasło"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onBlur={() => {
                  if (confirmPassword) {
                    const error = validateConfirmPassword(password, confirmPassword);
                    setConfirmPasswordError(error);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => {
                  const newShowConfirmPassword = !showConfirmPassword;
                  setShowConfirmPassword(newShowConfirmPassword);
                  setShowPassword(newShowConfirmPassword);
                }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Przycisk zmiany hasła */}
          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? 'Zmienianie hasła...' : 'Zmień hasło'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  formField: {
    width: '100%',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  passwordInputError: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 48,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordStrengthContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  passwordRequirement: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  requirementMet: {
    color: '#059669',
  },
  resetButton: {
    backgroundColor: '#069494',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 16,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
});