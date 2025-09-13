/**
 * Karta formularza rejestracji
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthModalStore } from '@/lib/zustand/authModalStore';

export default function SignUpCard() {
  const router = useRouter();
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const { showAuthModal } = useAuthModalStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła muszą być identyczne');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Błąd', 'Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    try {
      const result = await signUp({ 
        email: email.trim(), 
        password, 
        confirmPassword 
      });
      if (result.error) {
        Alert.alert('Błąd rejestracji', result.error);
        return;
      }
      Alert.alert(
        'Rejestracja zakończona!', 
        'Sprawdź swoją skrzynkę pocztową i kliknij link aktywacyjny.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Błąd rejestracji', error.message || 'Wystąpił problem podczas rejestracji');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Błąd rejestracji', error.message || 'Wystąpił problem podczas rejestracji przez Google');
    }
  };

  const handleGoToSignIn = () => {
    showAuthModal('signin');
  };

  return (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Utwórz nowe konto</Text>
        <Text style={styles.formSubtitle}>
          Wypełnij poniższe pola, aby rozpocząć przygodę z MatchTi
        </Text>
      </View>

      <View style={styles.formContent}>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Adres email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Wprowadź adres email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Hasło */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Hasło</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Wprowadź hasło (min. 6 znaków)"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Potwierdź hasło */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Potwierdź hasło</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Wprowadź ponownie hasło"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Przycisk rejestracji */}
        <TouchableOpacity 
          style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
          </Text>
        </TouchableOpacity>

        {/* Informacja o regulaminie */}
        <Text style={styles.termsText}>
          Rejestrując się, akceptujesz nasze{' '}
          <Text style={styles.termsLink}>Warunki korzystania</Text>
          {' '}i{' '}
          <Text style={styles.termsLink}>Politykę prywatności</Text>
        </Text>
      </View>

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>lub</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Social Auth */}
      <View style={styles.socialSection}>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={handleGoogleSignUp}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text style={styles.socialButtonText}>Kontynuuj z Google</Text>
        </TouchableOpacity>
      </View>

      {/* Link do logowania */}
      <View style={styles.signInLinkContainer}>
        <Text style={styles.signInLinkText}>Masz już konto? </Text>
        <TouchableOpacity onPress={handleGoToSignIn} activeOpacity={0.7}>
          <Text style={styles.signInLinkButton}>Zaloguj się</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContent: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  passwordToggle: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: '#069494',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -8,
  },
  termsLink: {
    color: '#069494',
    fontWeight: '500',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginHorizontal: 16,
  },
  socialSection: {
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  signInLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  signInLinkText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  signInLinkButton: {
    fontSize: 14,
    color: '#069494',
    fontFamily: 'Inter',
    fontWeight: '600',
  },
});