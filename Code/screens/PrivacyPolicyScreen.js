import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../utils/constants';

export default function PrivacyPolicyScreen({ navigation, route }) {
  // Lấy tiêu đề được truyền từ trang Profile sang
  const { title } = route.params || { title: 'Chính sách bảo mật' };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header tùy chỉnh */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.contentTitle}>1. Mục đích thu thập dữ liệu</Text>
          <Text style={styles.contentText}>
            Ứng dụng thu thập dữ liệu về các khoản chi tiêu, thu nhập và danh mục của bạn nhằm mục đích cung cấp các biểu đồ phân tích tài chính chính xác nhất.
          </Text>

          <Text style={styles.contentTitle}>2. Cam kết bảo mật</Text>
          <Text style={styles.contentText}>
            Chúng tôi cam kết không bán, chia sẻ hay cung cấp dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào. Mọi thông tin đều được mã hóa cục bộ trên thiết bị của bạn.
          </Text>

          <Text style={styles.contentTitle}>3. Quyền của người dùng</Text>
          <Text style={styles.contentText}>
            Bạn có quyền xuất dữ liệu, chỉnh sửa thông tin cá nhân hoặc yêu cầu xóa vĩnh viễn tài khoản thông qua phần "Vùng nguy hiểm" trong trang Cá nhân.
          </Text>

          <Text style={styles.contentTitle}>4. Thay đổi chính sách</Text>
          <Text style={styles.contentText}>
            Các điều khoản này có thể được cập nhật để phù hợp với quy định pháp luật. Chúng tôi sẽ thông báo cho bạn ngay khi có những thay đổi quan trọng.
          </Text>
        </View>
        
        <Text style={styles.footerText}>Cập nhật lần cuối: Tháng 4/2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 15 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    ...SHADOWS.light 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, ...SHADOWS.light },
  contentTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primaryDark, marginTop: 15, marginBottom: 8 },
  contentText: { fontSize: 14, color: '#475569', lineHeight: 22, textAlign: 'justify' },
  footerText: { textAlign: 'center', marginTop: 30, color: '#94A3B8', fontSize: 12 }
});