/**
 * Modal do zmiany hasła w profilu użytkownika
 */
import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { updatePassword } from '@/lib/api/auth';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stany walidacji
  const [newPasswordError, setNewPasswordError] = useState('');
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

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (text || newPasswordError) {
      const error = validatePassword(text);
      setNewPasswordError(error);
    }
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(text, confirmPassword);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text || confirmPasswordError) {
      const error = validateConfirmPassword(newPassword, text);
      setConfirmPasswordError(error);
    }
  };

  // Walidacja całego formularza
  const validateForm = () => {
    const newErr = validatePassword(newPassword);
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);

    setNewPasswordError(newErr);
    setConfirmPasswordError(confirmErr);

    return !newErr && !confirmErr;
  };

  // Obsługa zmiany hasła
  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(newPassword);

      if (result.error) {
        Alert.alert('Błąd', result.error);
        return;
      }

      Alert.alert(
        'Sukces',
        'Hasło zostało pomyślnie zmienione.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearForm();
              onClose();
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

  // Czyszczenie formularza
  const clearForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // Obsługa zamknięcia modalu
  const handleClose = () => {
    clearForm();
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            {/* Nagłówek */}
            <View style={styles.header}>
              <Text style={styles.title}>Zmień hasło</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Ustaw nowe, bezpieczne hasło dla swojego konta
            </Text>

            {/* Nowe hasło */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Nowe hasło</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, newPasswordError && styles.passwordInputError]}
                  placeholder="Wprowadź nowe hasło"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
                  onBlur={() => {
                    if (newPassword) {
                      const error = validatePassword(newPassword);
                      setNewPasswordError(error);
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => {
                    const newShow = !showNewPassword;
                    setShowNewPassword(newShow);
                    setShowConfirmPassword(newShow);
                  }}
                >
                  <Ionicons
                    name={showNewPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
              {newPassword && !newPasswordError && (
                <View style={styles.passwordStrengthContainer}>
                  <Text style={styles.passwordStrengthLabel}>Wymagania hasła:</Text>
                  <Text style={[styles.passwordRequirement, newPassword.length >= 8 && styles.requirementMet]}>
                    • Co najmniej 8 znaków
                  </Text>
                  <Text style={[styles.passwordRequirement, /(?=.*[a-z])/.test(newPassword) && styles.requirementMet]}>
                    • Mała litera
                  </Text>
                  <Text style={[styles.passwordRequirement, /(?=.*[A-Z])/.test(newPassword) && styles.requirementMet]}>
                    • Wielka litera
                  </Text>
                  <Text style={[styles.passwordRequirement, /(?=.*\d)/.test(newPassword) && styles.requirementMet]}>
                    • Cyfra
                  </Text>
                  <Text style={[styles.passwordRequirement, /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword) && styles.requirementMet]}>
                    • Znak specjalny (!@#$%^&* itp.)
                  </Text>
                </View>
              )}
            </View>

            {/* Potwierdzenie nowego hasła */}
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
                      const error = validateConfirmPassword(newPassword, confirmPassword);
                      setConfirmPasswordError(error);
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => {
                    const newShow = !showConfirmPassword;
                    setShowConfirmPassword(newShow);
                    setShowNewPassword(newShow);
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

            {/* Przyciski */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Anuluj</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleChangePassword}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Zmieniam...' : 'Zmień hasło'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#069494',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});