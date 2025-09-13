/**
 * Kontener autoryzacji dostosowany do modala
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthModalStore } from '@/lib/zustand/authModalStore';
import SignInCard from './SignInCard';
import SignUpCard from './SignUpCard';

interface ModalAuthContainerProps {
  initialTab?: 'signin' | 'signup';
}

export default function ModalAuthContainer({ initialTab = 'signin' }: ModalAuthContainerProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const { hideAuthModal } = useAuthModalStore();

  return (
    <View style={styles.container}>
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

      {/* Zawartość formularza */}
      <View style={styles.content}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
          {activeTab === 'signin' ? 'Zaloguj się' : 'Zarejestruj się'}
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Formularz {activeTab === 'signin' ? 'logowania' : 'rejestracji'} działa!
        </Text>
        
        <TouchableOpacity 
          style={{ padding: 12, backgroundColor: '#069494', borderRadius: 8, marginBottom: 10 }}
          onPress={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
            {activeTab === 'signin' ? 'Przejdź do rejestracji' : 'Przejdź do logowania'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ padding: 8 }}
          onPress={hideAuthModal}
        >
          <Text style={{ color: '#666', textAlign: 'center' }}>Zamknij modal</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});