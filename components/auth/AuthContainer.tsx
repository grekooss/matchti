/**
 * Główny kontener uwierzytelniania z animowanymi kartami
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthModalStore } from '@/lib/zustand/authModalStore';
import SignInCard from './SignInCard';
import SignUpCard from './SignUpCard';

interface AuthContainerProps {
  initialTab?: 'signin' | 'signup';
}


export default function AuthContainer({ initialTab = 'signin' }: AuthContainerProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const { hideAuthModal } = useAuthModalStore();

  const switchTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Przycisk zamknięcia */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={hideAuthModal}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Karta formularza */}
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.cardContainer}>
              {activeTab === 'signin' ? <SignInCard /> : <SignUpCard />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
});