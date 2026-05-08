import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../utils/constants';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State để điều khiển ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading } = useContext(AuthContext);

  const handleRegister = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // 1. Kiểm tra bỏ trống
    if (!trimmedFullName || !trimmedUsername || !trimmedPassword || !confirmPassword) {
      return Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các thông tin.');
    }

    // 2. Kiểm tra độ dài Họ tên
    if (trimmedFullName.length < 2) {
      return Alert.alert('Lỗi', 'Họ và tên phải có ít nhất 2 ký tự.');
    }

    // 3. Kiểm tra email định dạng @gmail.com
    const emailRegex = /^[^\s@]+@gmail\.com$/; 
    if (!emailRegex.test(trimmedUsername)) {
      return Alert.alert('Lỗi định dạng', 'Tên đăng nhập phải là Gmail (ví dụ: user@gmail.com)');
    }

    // 4. Kiểm tra độ dài Mật khẩu
    if (trimmedPassword.length < 6) {
      return Alert.alert('Lỗi bảo mật', 'Mật khẩu phải có ít nhất 6 ký tự.');
    }

    // 5. Kiểm tra Xác nhận mật khẩu khớp nhau
    if (trimmedPassword !== confirmPassword) {
      return Alert.alert('Lỗi xác nhận', 'Mật khẩu xác nhận không trùng khớp.');
    }

    // Gửi dữ liệu đăng ký
    const result = await register(trimmedUsername, trimmedPassword, trimmedFullName);
    
    if (result.success) {
      Alert.alert('Chúc mừng!', 'Tài khoản của bạn đã được tạo thành công.', [
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Lỗi đăng ký', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.dark} />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Bắt đầu quản lý tài chính chuyên nghiệp</Text>
          </View>

          <View style={styles.form}>
            {/* Họ và tên */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-circle-outline" size={22} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput 
                placeholder="Họ và tên" 
                style={styles.input} 
                value={fullName} 
                onChangeText={setFullName} 
              />
            </View>

            {/* Tên đăng nhập (Gmail) */}
            <View style={styles.inputContainer}>
              <Ionicons name="at-outline" size={22} color={COLORS.gray} style={styles.inputIcon} />
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
              <Ionicons name="lock-closed-outline" size={22} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput 
                placeholder="Mật khẩu" 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} // Ẩn/hiện mật khẩu
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color={COLORS.gray} 
                />
              </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu */}
            <View style={styles.inputContainer}>
              <Ionicons name="checkmark-done-outline" size={22} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput 
                placeholder="Xác nhận mật khẩu" 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={!showConfirmPassword} // Ẩn/hiện mật khẩu
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color={COLORS.gray} 
                />
              </TouchableOpacity>
            </View>

            {/* Nút Đăng ký */}
            <TouchableOpacity 
              style={styles.registerBtn} 
              onPress={handleRegister} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>ĐĂNG KÝ</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 30, flexGrow: 1 },
  backBtn: { marginBottom: 20 },
  headerSection: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.dark },
  subtitle: { color: COLORS.gray, fontSize: 16, marginTop: 5 },
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
  registerBtn: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 15, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15, 
    ...SHADOWS.medium 
  },
  registerBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 18, letterSpacing: 1 }
});