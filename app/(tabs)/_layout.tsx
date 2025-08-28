import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  return <FontAwesome size={24} name={props.name} color={props.color} style={{ marginBottom: -3 }} />;
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
  return <MaterialIcons size={24} name={props.name} color={props.color} style={{ marginBottom: -3 }} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#069494',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 70,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter',
          fontWeight: '500',
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matchti',
          tabBarIcon: ({ color, focused }) => <MaterialTabBarIcon name="sports-tennis" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
