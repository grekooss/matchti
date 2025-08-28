import MatchtiActiveIcon from '@/assets/icons/Matchti.svg';
import MatchtiIcon from '@/assets/icons/Matchti2.svg';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NeumorphicButton } from './ui/NeumorphicButton';

/**
 * CustomTabBar
 * Tylko dwa taby po bokach i centralny przycisk
 */
const TAB_BAR_HEIGHT = 86;

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.tabButtonContainer, { left: 32 }]}>
        <NeumorphicButton
          onPress={() => navigation.navigate(state.routes[0].name)}
          icon={<Ionicons name="search" size={24} />}
          text="Szukaj"
          outerColors={
            state.index === 0 ? ['#99A0A966', '#FFFFFF66'] : undefined
          }
          middleColors={state.index === 0 ? ['#D99AFA', '#BA3D4F'] : undefined}
          innerColors={state.index === 0 ? ['#D99AFA', '#BA3D4F'] : undefined}
          iconColor={state.index === 0 ? 'white' : '#71717a'}
          size={56}
        />
      </View>

      <View style={[styles.tabButtonContainer, { right: 32 }]}>
        <NeumorphicButton
          onPress={() => navigation.navigate(state.routes[2].name)}
          icon={<Ionicons name="person-circle-outline" size={24} />}
          text="Profil"
          outerColors={
            state.index === 2 ? ['#99A0A966', '#FFFFFF66'] : undefined
          }
          middleColors={state.index === 2 ? ['#D99AFA', '#BA3D4F'] : undefined}
          innerColors={state.index === 2 ? ['#D99AFA', '#BA3D4F'] : undefined}
          iconColor={state.index === 2 ? 'white' : '#71717a'}
          size={56}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(state.routes[1].name)}
      >
        {state.index === 1 ? (
          <MatchtiActiveIcon width={96} height={96} />
        ) : (
          <MatchtiIcon width={96} height={96} />
        )}
      </TouchableOpacity>

      <View style={styles.centerLabelWrapper}>
        <Text
          style={[
            styles.centerLabelText,
            { color: state.index === 1 ? '#000000' : '#717171' },
          ]}
        >
          Matchti
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerLabelWrapper: {
    position: 'absolute',
    bottom: 30, // Przesunięte wyżej, bliżej ikony
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  centerLabelText: {
    fontSize: 14, // Larger font size
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT + 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabButtonContainer: {
    position: 'absolute',
    bottom: 32,
    zIndex: 2,
  },
  textLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#717171',
    fontFamily: 'Inter-Regular',
  },
  fab: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -40 }],
    bottom: 45, // Adjusted for larger size
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
});

export default CustomTabBar;
