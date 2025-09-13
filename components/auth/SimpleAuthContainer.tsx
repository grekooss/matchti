import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthModalStore } from '@/lib/zustand/authModalStore';

interface SimpleAuthContainerProps {
  initialTab?: 'signin' | 'signup';
}

export default function SimpleAuthContainer({ initialTab = 'signin' }: SimpleAuthContainerProps) {
  const { hideAuthModal, isVisible, modalType } = useAuthModalStore();
  
  console.log('SimpleAuthContainer render:', { isVisible, modalType, initialTab });

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

      <View style={styles.content}>
        <Text style={styles.title}>
          {initialTab === 'signin' ? 'Zaloguj się' : 'Zarejestruj się'}
        </Text>
        <Text style={styles.subtitle}>Prosty formularz autoryzacji</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    flex: 1,
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});