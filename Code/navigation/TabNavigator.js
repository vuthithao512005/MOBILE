import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import đầy đủ 5 màn hình
import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen';
import ListScreen from '../screens/ListScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { COLORS, SHADOWS } from '../utils/constants';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          
          // Logic chọn icon cho 5 nút
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'receipt' : 'receipt-outline'; // Icon biên lai cho lịch sử
          } else if (route.name === 'Stats') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline'; // Icon biểu đồ cho thống kê
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          // Tăng size icon lên một chút cho dễ bấm
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarShowLabel: false, // Ẩn chữ để thanh menu trông gọn và sang hơn
        tabBarStyle: { 
          position: 'absolute', 
          bottom: 20, 
          left: 20, 
          right: 20,
          elevation: 0, 
          backgroundColor: COLORS.white, 
          borderRadius: 24,
          height: 70, 
          borderTopWidth: 0, 
          ...SHADOWS.medium,
          paddingBottom: 0
        },
        headerShown: false
      })}
    >
      {/* THỨ TỰ CÁC THẺ Ở ĐÂY SẼ QUYẾT ĐỊNH VỊ TRÍ NÚT TRÊN MÀN HÌNH */}
      <Tab.Screen name="Home" component={HomeScreen} />
      
      {/* Đưa Add lên trước List theo đúng ý bạn */}
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="List" component={ListScreen} />
      
      <Tab.Screen name="Stats" component={StatisticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> 
    </Tab.Navigator>
  );
}