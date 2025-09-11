import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from 'expo-router';
import { View, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path } from 'react-native-svg';
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
        borderRadius: 10,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FontAwesome size={18} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return (
    <View style={{
      backgroundColor: '#F0F9FF',
      borderRadius: 10,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <FontAwesome size={18} name={props.name} color="#069494" style={{ marginBottom: 0 }} />
    </View>
  );
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
        borderRadius: 10,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <MaterialIcons size={18} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return (
    <View style={{
      backgroundColor: '#F0F9FF',
      borderRadius: 10,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <MaterialIcons size={18} name={props.name} color="#069494" style={{ marginBottom: 0 }} />
    </View>
  );
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
        borderRadius: 10,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Feather size={18} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return (
    <View style={{
      backgroundColor: '#F0F9FF',
      borderRadius: 10,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Feather size={18} name={props.name} color="#069494" style={{ marginBottom: 0 }} />
    </View>
  );
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
        borderRadius: 12,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons size={22} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return (
    <View style={{
      backgroundColor: '#F0F9FF',
      borderRadius: 12,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Ionicons size={22} name={props.name} color="#069494" style={{ marginBottom: 0, strokeWidth: 2.5 }} />
    </View>
  );
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
        borderRadius: 10,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AntDesign size={18} name={props.name} color="#FFFFFF" style={{ marginBottom: 0 }} />
      </View>
    );
  }
  return (
    <View style={{
      backgroundColor: '#F0F9FF',
      borderRadius: 10,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <AntDesign size={18} name={props.name} color="#069494" style={{ marginBottom: 0 }} />
    </View>
  );
}

function MatchtiTabBarIcon(props: {
  color: string;
  focused: boolean;
}) {
  const iconSize = 70;
  
  if (props.focused) {
    return <MatchtiIcon width={iconSize} height={iconSize} fill="#069494" color="#069494" style={{ marginBottom: 0 }} />;
  }
  
  // Nieaktywna ikona z borderem tylko na głównym kształcie płomienia (bez trójkąta)
  return (
    <View style={{ width: iconSize, height: iconSize, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 180 180">
        <G transform="translate(-15.3 -27.9)">
          {/* Główny kształt płomienia bez bordera */}
          <Path 
            d="m 174.6 159.2 c -0.8 -2.7 -0.4 -2 -22.3 -39.8 c -6.5 -11.2 -15.1 -26.1 -19.2 -33.2 c -4.1 -7.1 -8 -13.9 -8.8 -15.2 c -0.8 -1.3 -2.1 -3.6 -2.9 -5 c -2 -3.5 -3 -4.8 -4.9 -6.5 c -3 -2.8 -6.8 -4.2 -11.2 -4.2 c -4.9 0 -8.5 1.5 -11.8 4.8 c -2 2 -3.3 3.9 -7.6 11.6 c -0.9 1.5 -4.2 7.4 -7.5 13 c -5.2 9.1 -14.8 25.5 -26.7 46.3 c -2.2 3.9 -4.6 7.9 -5.2 9 c -0.7 1.1 -1.6 2.7 -2.1 3.6 c -0.5 0.9 -2 3.5 -3.4 5.9 c -1.4 2.4 -3.1 5.4 -3.7 6.7 c -3.3 6.8 -2.4 14 2.5 19.2 c 2 2.1 3.5 3.2 6.2 4.3 l 5.1 0.8 h 54.3 l 54.8 0 4.2 -0.6 c 3.5 -0.5 6.1 -3.6 8 -6.3 c 0.8 -1.2 2.4 -4.7 2.7 -5.9 c 0.3 -1.3 -0.1 -7 -0.5 -8.4 z"
            fill="#F0F9FF"
            stroke="none"
          />
          
          {/* Wewnętrzne łezki z borderem */}
          <Path 
            d="m 103.2 102.6 c -1 0 -5.3 0.9 -7.2 1.5 c -2.5 0.8 -5.7 2.4 -7.9 3.9 c -2.2 1.5 -5.5 4.7 -7.3 7.1 c -1.4 1.9 -3.4 5.5 -3.8 6.8 l -0.2 0.6 l 1 -0.5 c 0.6 -0.3 3.7 -1.6 7 -2.9 c 8 -3.2 9.3 -3.8 11.8 -5.5 c 3.5 -2.3 5.4 -4.9 6.5 -8.7 c 0.6 -2 0.6 -2.3 0.1 -2.3 z"
            fill="white"
            stroke="#069494"
            strokeWidth="2.8"
          />
          <Path 
            d="m 132.4 118.2 c -2 -3.6 -6 -8 -9.4 -10.2 c -3.1 -2.1 -8 -4.2 -10.9 -4.7 c -1 -0.2 -1.1 -0.1 -1.2 0.4 c -0.6 2.8 -0.8 3.8 -1.5 5.6 c -1 2.7 -2.9 5.5 -5.2 7.6 c -3.5 3.3 -6.6 4.9 -15.9 8.7 c -6.4 2.6 -10.4 4.4 -12.5 5.7 c -1 0.6 -1 0.7 -1 2.3 c 0 0.9 0.2 2.8 0.4 4.2 c 1.7 11.2 9.2 20.5 19.9 24.5 c 0.9 0.3 1.7 0.6 1.9 0.6 c 0.2 0 2.7 -3.1 3.8 -5 c 1.1 -1.7 3.5 -6.6 5.4 -10.8 c 0.8 -1.9 2.2 -4.8 3.1 -6.6 c 5.5 -11 12.4 -16.1 24.1 -17.7 l 1.2 -0.2 l -0.7 -1.5 c -0.4 -0.8 -1 -2.2 -1.5 -3 z"
            fill="white"
            stroke="#069494"
            strokeWidth="2.8"
          />
          <Path 
            d="m 136 130.2 c -0.4 -0.4 -4.8 0.4 -7.3 1.2 c -7 2.3 -10.4 6.3 -15.7 18.3 c -2.7 6 -4 8.8 -5.7 11.6 c -0.9 1.5 -1.6 2.8 -1.5 2.8 c 0.1 0.1 1.3 0 2.7 -0.2 c 14.2 -1.5 25.2 -12 27.5 -26.1 c 0.4 -2.2 0.4 -7.3 0 -7.6 z"
            fill="white"
            stroke="#069494"
            strokeWidth="2.8"
          />
        </G>
      </Svg>
    </View>
  );
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
        initialRouteName="search"
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
