/**
 * Karta auth do wstawiania w layout strony między nagłówkiem a navtabem
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import SignInCard from './SignInCard';
import SignUpCard from './SignUpCard';

interface AuthCardProps {
  visible: boolean;
  onClose?: () => void;
  initialTab?: 'signin' | 'signup';
}

const { width: screenWidth } = Dimensions.get('window');

export default function AuthCard({ visible, onClose, initialTab = 'signin' }: AuthCardProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const slideAnim = useRef(new Animated.Value(visible ? 0 : screenWidth)).current;
  const cardSlideAnim = useRef(new Animated.Value(0)).current;

  // Animacja pokazania/ukrycia karty
  React.useEffect(() => {
    if (visible) {
      // Pokaż kartę - wjazd z prawej strony
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Ukryj kartę - wyjazd w prawą stronę
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const switchTab = (tab: 'signin' | 'signup') => {
    if (tab === activeTab) return;

    // Animacja przełączania kart
    Animated.sequence([
      // Ukryj obecną kartę
      Animated.timing(cardSlideAnim, {
        toValue: screenWidth,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Zmień aktywny tab
      setActiveTab(tab);
      
      // Wjazd nowej karty z prawej strony
      cardSlideAnim.setValue(screenWidth);
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      {/* Header z przyciskiem zamknij */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTab === 'signin' ? 'Zaloguj się' : 'Zarejestruj się'}
        </Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nawigacja tabów */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signin' && styles.activeTab]}
          onPress={() => switchTab('signin')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>
            Logowanie
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
          onPress={() => switchTab('signup')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
            Rejestracja
          </Text>
        </TouchableOpacity>
      </View>

      {/* Animowana karta formularza */}
      <Animated.View 
        style={[
          styles.cardContainer,
          { 
            transform: [{ translateX: cardSlideAnim }]
          }
        ]}
      >
        {activeTab === 'signin' ? <SignInCard /> : <SignUpCard />}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  activeTabText: {
    color: '#069494',
    fontWeight: '600',
  },
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
});