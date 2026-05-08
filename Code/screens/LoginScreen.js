import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../utils/constants';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useContext(AuthContext);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // 1. Kiểm tra bỏ trống
    if (!trimmedUsername || !trimmedPassword) {
      return Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
    }

    // 2. Kiểm tra định dạng Gmail (Đồng bộ với Register)
    const emailRegex = /^[^\s@]+@gmail\.com$/; 
    if (!emailRegex.test(trimmedUsername)) {
      return Alert.alert('Lỗi định dạng', 'Tên đăng nhập phải là Gmail (ví dụ: user@gmail.com)');
    }

    // 3. Kiểm tra độ dài mật khẩu tối thiểu (Để tránh spam DB)
    if (trimmedPassword.length < 6) {
      return Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
    }

    const result = await login(trimmedUsername, trimmedPassword);
    if (!result.success) {
      Alert.alert('Đăng nhập thất bại', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.headerSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="wallet" size={60} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>SpendWise</Text>
            <Text style={styles.welcomeText}>Quản lý tài chính thông minh</Text>
          </View>

          <View style={styles.form}>
            {/* Tên đăng nhập */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                placeholder="Email (@gmail.com)"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Mật khẩu */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                placeholder="Mật khẩu"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color={COLORS.gray} 
                />
              </TouchableOpacity>
            </View>

            {/* Nút Đăng nhập */}
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={handleLogin} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 30, flexGrow: 1, justifyContent: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: '#f0f4f8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    ...SHADOWS.light 
  },
  appName: { fontSize: 32, fontWeight: '800', color: COLORS.dark, marginTop: 15 },
  welcomeText: { color: COLORS.gray, fontSize: 16, marginTop: 5 },
  form: { width: '100%' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5f7f9', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    height: 60, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.dark, fontSize: 16 },
  loginBtn: { 
    backgroundColor: COLORS.dark, 
    borderRadius: 15, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15, 
    ...SHADOWS.medium 
  },
  loginBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 18, letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: COLORS.gray, fontSize: 15 },
  linkText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 }
});