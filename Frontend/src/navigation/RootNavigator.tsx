import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import SettlementsScreen from '../screens/SettlementsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1CC29F',
        tabBarInactiveTintColor: '#7F8C8D',
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {height: 60, paddingBottom: 6},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{color, fontSize: size ?? 20}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{color, fontSize: size ?? 20}}>➕</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settlements"
        component={SettlementsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{color, fontSize: size ?? 20}}>💸</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{color, fontSize: size ?? 20}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
