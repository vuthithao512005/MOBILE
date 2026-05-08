import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// 1. IMPORT CÁC MÀN HÌNH AUTH
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// 2. IMPORT LUỒNG CHÍNH VÀ CÁC MÀN HÌNH CHỨC NĂNG
import TabNavigator from './TabNavigator';
import EditScreen from '../screens/EditScreen';
import BudgetScreen from '../screens/BudgetScreen';
import GuideScreen from '../screens/GuideScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen'; // Đã thêm để chạy Chính sách & Điều khoản

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user == null ? (
        // LUỒNG KHI CHƯA ĐĂNG NHẬP
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // LUỒNG KHI ĐÃ ĐĂNG NHẬP
        <>
          {/* Màn hình chính chứa các Tab (Home, List, Stats, Profile) */}
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          
          {/* Các màn hình con bổ trợ */}
          <Stack.Screen name="Edit" component={EditScreen} />
          <Stack.Screen name="Budget" component={BudgetScreen} />
          <Stack.Screen name="Guide" component={GuideScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}