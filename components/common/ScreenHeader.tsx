import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MatchtiIcon from '@/assets/icons/matchti.svg';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  useMatchtiIcon?: boolean;
}

export default function ScreenHeader({ title, subtitle, iconName, useMatchtiIcon = false }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  const renderIcon = () => {
    if (useMatchtiIcon) {
      return <MatchtiIcon width={55} height={55} color="rgba(255, 255, 255, 0.2)" />;
    }
    
    if (iconName) {
      return <Ionicons name={iconName} size={24} color="#FFFFFF" />;
    }
    
    return null;
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 4 }]}>
      <View style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={useMatchtiIcon ? styles.matchtiIconContainer : styles.iconContainer}>
                {renderIcon()}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'transparent',
  },
  safeArea: {
    marginHorizontal: 12,
    marginTop: 4,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  headerContent: {
    backgroundColor: '#069494',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchtiIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter',
  },
});