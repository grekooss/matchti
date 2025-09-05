import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from 'expo-router';
import { View, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MatchtiIcon from '@/assets/icons/matchti.svg';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  if (props.focused) {
    return (
      <View style={{
        backgroundColor: '#069494',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FontAwesome size={20} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return <FontAwesome size={24} name={props.name} color={props.color} style={{ marginBottom: 0 }} />;
}

function MaterialTabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  focused: boolean;
}) {
  if (props.focused) {
    return (
      <View style={{
        backgroundColor: '#069494',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <MaterialIcons size={20} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return <MaterialIcons size={24} name={props.name} color={props.color} style={{ marginBottom: 0 }} />;
}

function FeatherTabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  focused: boolean;
}) {
  if (props.focused) {
    return (
      <View style={{
        backgroundColor: '#069494',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Feather size={20} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return <Feather size={24} name={props.name} color={props.color} style={{ marginBottom: 0 }} />;
}

function IoniconTabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
}) {
  if (props.focused) {
    return (
      <View style={{
        backgroundColor: '#069494',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons size={20} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return <Ionicons size={24} name={props.name} color={props.color} style={{ marginBottom: 0 }} />;
}

function AntTabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
  focused: boolean;
}) {
  if (props.focused) {
    return (
      <View style={{
        backgroundColor: '#069494',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AntDesign size={20} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return <AntDesign size={24} name={props.name} color={props.color} style={{ marginBottom: 0 }} />;
}

function MatchtiTabBarIcon(props: {
  color: string;
  focused: boolean;
}) {
  // 80% wysokości navbara (60px) = 48px
  const iconSize = 70;
  return <MatchtiIcon width={iconSize} height={iconSize} fill={props.focused ? '#069494' : props.color} style={{ marginBottom: 0 }} />;
}

// Podstawowa wysokość reklamy Google AdMob (bez safe area)
const AD_BASE_HEIGHT = 60;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Dynamiczne obliczanie wysokości reklamy na podstawie safe area
  // Na urządzeniach bez Home Indicator (iPhone 8, starsze Android) - insets.bottom = 0, więc reklama sama dodaje padding
  // Na urządzeniach z Home Indicator (iPhone X+, nowsze Android) - insets.bottom > 0, więc nie dodajemy dodatkowego paddingu
  const adContainerHeight = AD_BASE_HEIGHT + (insets.bottom > 0 ? insets.bottom : 0);
  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#069494',
          tabBarInactiveTintColor: '#718096',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E2E8F0',
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 60 + insets.bottom : 60,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
            paddingTop: 10,
            position: 'absolute',
            bottom: adContainerHeight, // Używamy dynamicznej wysokości
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarIconStyle: {
            margin: 0,
          },
          headerShown: false,
        }}>
      <Tabs.Screen
        name="search"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => <IoniconTabBarIcon name="search-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => <MatchtiTabBarIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => <IoniconTabBarIcon name="person-outline" color={color} focused={focused} />,
        }}
      />
    </Tabs>
    
    {/* Miejsce na reklamę Google */}
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: adContainerHeight,
      backgroundColor: '#F8F9FA',
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      paddingBottom: insets.bottom, // Safe area jest już uwzględniona w adContainerHeight
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
      }}>
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
          fontFamily: 'Inter',
        }}>
          Miejsce na reklamę Google AdMob
        </Text>
      </View>
    </View>
  </View>
  );
}
