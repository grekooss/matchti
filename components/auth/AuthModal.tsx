/**
 * Nakładka autoryzacji - dostosowuje się do zawartości
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAuthModalStore } from '@/lib/zustand/authModalStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Komponent ikony Google z gradientem
const GoogleIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4285f4" />
        <Stop offset="100%" stopColor="#34a853" />
      </LinearGradient>
      <LinearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#ea4335" />
        <Stop offset="100%" stopColor="#fbbc04" />
      </LinearGradient>
      <LinearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#fbbc04" />
        <Stop offset="100%" stopColor="#34a853" />
      </LinearGradient>
    </Defs>
    {/* Litera G z kolorami Google */}
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285f4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34a853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#fbbc04"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#ea4335"
    />
  </Svg>
);

export default function AuthModal() {
  const { isVisible, modalType, hideAuthModal, showAuthModal } = useAuthModalStore();
  const { signUp, signIn, signInWithGoogle, resetPassword, isLoading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  // Stany formularza
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Stany walidacji
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Funkcje walidacyjne
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email jest wymagany';
    }
    if (!emailRegex.test(email)) {
      return 'Nieprawidłowy format email';
    }
    return '';
  };

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
  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Walidacja formatowania w czasie rzeczywistym
    if (text || emailError) {
      const error = validateEmail(text);
      setEmailError(error);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Walidacja w czasie rzeczywistym - zawsze sprawdzaj gdy hasło było już wprowadzane
    if (text || passwordError) {
      const error = validatePassword(text);
      setPasswordError(error);
    }
    // Jeśli jest tryb rejestracji i potwierdzenie hasła zostało już wpisane
    if (isSignUp && confirmPassword) {
      const confirmError = validateConfirmPassword(text, confirmPassword);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    // Walidacja w czasie rzeczywistym - zawsze sprawdzaj gdy potwierdzenie było już wprowadzane
    if (text || confirmPasswordError) {
      const error = validateConfirmPassword(password, text);
      setConfirmPasswordError(error);
    }
  };

  // Walidacja całego formularza
  const validateForm = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    let confirmPasswordErr = '';

    if (isSignUp) {
      confirmPasswordErr = validateConfirmPassword(password, confirmPassword);
    }

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    return !emailErr && !passwordErr && !confirmPasswordErr;
  };

  // Obsługa submitu
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitError('');
    clearError();

    try {
      let result;

      if (isSignUp) {
        result = await signUp({
          email,
          password,
          confirmPassword,
        });
      } else {
        result = await signIn({
          email,
          password,
        });
      }

      if (result?.error) {
        setSubmitError(result.error);
        return;
      }

      console.log('AuthModal handleSubmit - isSignUp:', isSignUp);
      console.log('AuthModal handleSubmit - result:', JSON.stringify(result, null, 2));

      // Sprawdź czy rejestracja lub logowanie wymaga potwierdzenia emaila
      if (result?.requiresEmailConfirmation) {
        console.log('AuthModal - wykryto potrzebę potwierdzenia emaila podczas:', isSignUp ? 'rejestracji' : 'logowania');
        setEmailConfirmationSent(true);
        setConfirmationEmail(result.email || email);
        return;
      }

      // Sukces - zamknij modal i wyczyść formularz
      handleCloseModal();
    } catch (error) {
      setSubmitError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    }
  };

  // Obsługa resetowania hasła
  const handleResetPassword = async () => {
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    setSubmitError('');
    clearError();

    try {
      const result = await resetPassword({ email });

      if (result?.error) {
        setSubmitError(result.error);
        return;
      }

      setResetEmailSent(true);
    } catch (error) {
      setSubmitError('Wystąpił błąd podczas wysyłania emaila resetującego.');
    }
  };

  // Funkcja czyszcząca stan formularza
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSubmitError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResetEmailSent(false);
    setEmailConfirmationSent(false);
    setConfirmationEmail('');
    clearError();
  };

  // Funkcja zamykania modalu z czyszczeniem
  const handleCloseModal = () => {
    clearForm();
    hideAuthModal();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const isSignUp = modalType === 'signup';
  const isResetPassword = modalType === 'reset-password';


  // Jeśli email został wysłany, pokaż komunikat potwierdzenia
  if (resetEmailSent && isResetPassword) {
    return (
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Email wysłany</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#059669" />
              <Text style={styles.successTitle}>Sprawdź swoją skrzynkę pocztową</Text>
              <Text style={styles.successMessage}>
                Wysłaliśmy link do resetowania hasła na adres:{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>{'\n\n'}
                Kliknij w link w emailu, aby ustawić nowe hasło.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.loginButtonText}>Zamknij</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => {
                setResetEmailSent(false);
                showAuthModal('signin');
              }}
            >
              <Text style={styles.registerLinkText}>
                Powrót do <Text style={styles.registerLinkBold}>logowania</Text>
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Jeśli email potwierdzający został wysłany, pokaż komunikat
  console.log('AuthModal render - emailConfirmationSent:', emailConfirmationSent, 'isSignUp:', isSignUp, 'modalType:', modalType);
  if (emailConfirmationSent && (isSignUp || modalType === 'signin')) {
    return (
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Potwierdź swój email</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.successContainer}>
              <Ionicons name="mail" size={64} color="#069494" />
              <Text style={styles.successTitle}>Sprawdź swoją skrzynkę pocztową</Text>
              <Text style={styles.successMessage}>
                {isSignUp
                  ? 'Wysłaliśmy link potwierdzający na adres:'
                  : 'Twój email wymaga potwierdzenia. Wysłaliśmy ponownie link na adres:'
                }{'\n'}
                <Text style={styles.emailHighlight}>{confirmationEmail}</Text>{'\n\n'}
                Kliknij w link w emailu, aby {isSignUp ? 'aktywować swoje konto' : 'potwierdzić email i móc się zalogować'}.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.loginButtonText}>Rozumiem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => {
                setEmailConfirmationSent(false);
                showAuthModal('signin');
              }}
            >
              <Text style={styles.registerLinkText}>
                Masz już konto? <Text style={styles.registerLinkBold}>Zaloguj się</Text>
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isKeyboardVisible && styles.scrollContainerWithKeyboard
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        indicatorStyle="default"
      >
        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            {/* Nagłówek z przyciskiem zamknięcia */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {isResetPassword ? 'Resetuj hasło' : isSignUp ? 'Zarejestruj się' : 'Zaloguj się'}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              {isResetPassword
                ? 'Wprowadź swój adres email, a my wyślemy Ci link do resetowania hasła'
                : isSignUp
                ? 'Utwórz nowe konto, aby rozpocząć korzystanie z aplikacji'
                : 'Wprowadź swoje dane, aby uzyskać dostęp do aplikacji'
              }
            </Text>

            {/* Pola formularza */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, emailError && styles.textInputError]}
                placeholder="Wprowadź adres email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => {
                  if (email) {
                    const error = validateEmail(email);
                    setEmailError(error);
                  }
                }}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Wyświetl hasło tylko gdy nie resetujemy hasła */}
            {!isResetPassword && (
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Hasło</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, passwordError && styles.passwordInputError]}
                  placeholder={isSignUp ? "Utwórz hasło" : "Wprowadź hasło"}
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
                    if (isSignUp) {
                      setShowConfirmPassword(newShowPassword);
                    }
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
              {isSignUp && password && !passwordError && (
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
            )}

            {/* Potwierdzenie hasła tylko dla rejestracji */}
            {isSignUp && !isResetPassword && (
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Potwierdź hasło</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, confirmPasswordError && styles.passwordInputError]}
                    placeholder="Potwierdź hasło"
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
            )}

            {/* Wyświetlanie błędów */}
            {(submitError || error) && (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.errorText}>
                  {submitError || error}
                </Text>
              </View>
            )}

            {/* Przycisk główny */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={isResetPassword ? handleResetPassword : handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading
                  ? (isResetPassword ? 'Wysyłanie...' : isSignUp ? 'Rejestracja...' : 'Logowanie...')
                  : (isResetPassword ? 'Wyślij link resetujący' : isSignUp ? 'Zarejestruj się' : 'Zaloguj się')
                }
              </Text>
            </TouchableOpacity>

            {/* Separator i przycisk Google tylko gdy nie resetujemy hasła */}
            {!isResetPassword && (
              <>
                <View style={styles.separator}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorText}>lub</Text>
                  <View style={styles.separatorLine} />
                </View>

                {/* Przycisk Google */}
                <TouchableOpacity
              style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
              onPress={async () => {
                if (isLoading) return;

                setSubmitError('');
                clearError();

                try {
                  const result = await signInWithGoogle();
                  if (result?.error) {
                    setSubmitError(result.error);
                    return;
                  }
                  // Sukces - zamknij modal
                  handleCloseModal();
                } catch (error) {
                  setSubmitError('Wystąpił błąd podczas logowania przez Google');
                }
              }}
              disabled={isLoading}
            >
              <View style={{ marginRight: 12 }}>
                <GoogleIcon size={20} />
              </View>
              <Text style={styles.googleButtonText}>
                {isLoading
                  ? 'Logowanie...'
                  : (isSignUp ? 'Zarejestruj się przez Google' : 'Zaloguj się przez Google')
                }
              </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Link przełączający */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => {
                clearForm();
                if (isResetPassword) {
                  showAuthModal('signin');
                } else {
                  showAuthModal(isSignUp ? 'signin' : 'signup');
                }
              }}
            >
              <Text style={styles.registerLinkText}>
                {isResetPassword
                  ? <>Pamiętasz hasło? <Text style={styles.registerLinkBold}>Zaloguj się</Text></>
                  : isSignUp
                  ? <>Masz już konto? <Text style={styles.registerLinkBold}>Zaloguj się</Text></>
                  : <>Nie masz konta? <Text style={styles.registerLinkBold}>Zarejestruj się</Text></>
                }
              </Text>
            </TouchableOpacity>

            {/* Link do resetowania hasła tylko na stronie logowania */}
            {!isSignUp && !isResetPassword && (
              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => {
                  clearForm();
                  showAuthModal('reset-password');
                }}
              >
                <Text style={styles.forgotPasswordText}>
                  Zapomniałeś hasła?
                </Text>
              </TouchableOpacity>
            )}
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
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  scrollContainerWithKeyboard: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    paddingVertical: 40,
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
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
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
  loginButton: {
    backgroundColor: '#069494',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  generalErrorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  registerLink: {
    padding: 8,
  },
  registerLinkText: {
    color: '#069494',
    fontSize: 14,
    textAlign: 'center',
  },
  registerLinkBold: {
    fontWeight: '600',
  },
  // Style dla walidacji
  textInputError: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },
  passwordInputError: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  // Style dla wskaźnika siły hasła
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
  // Style dla resetowania hasła
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#069494',
  },
  forgotPasswordLink: {
    padding: 8,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#069494',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});