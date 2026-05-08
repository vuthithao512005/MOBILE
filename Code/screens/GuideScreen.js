import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../utils/constants';

export default function GuideScreen({ navigation }) {
  const guides = [
    {
      icon: 'add-circle', color: '#2ECC71', bg: '#E8F8F5',
      title: '1. Thêm & Sửa giao dịch',
      desc: 'Bấm vào nút "Thêm GD" ở trang chủ. Nếu muốn Sửa hoặc Xóa, hãy vào phần "Giao dịch gần đây" hoặc mục Lịch sử, bấm trực tiếp vào giao dịch đó.'
    },
    {
      icon: 'wallet', color: '#F1C40F', bg: '#FEF9E7',
      title: '2. Cách hoạt động của Ngân sách',
      desc: 'Ngân sách giúp bạn giới hạn số tiền chi tiêu trong tháng. Bạn có thể bật công tắc "Cộng dồn" để lấy tiền dư từ tháng trước đắp vào tháng này.'
    },
    {
      icon: 'flash', color: '#D97706', bg: '#FEF3C7',
      title: '3. Gợi ý chi tiêu hàng ngày',
      desc: 'Trong trang Ngân sách, hệ thống sẽ tự động lấy số dư còn lại chia cho số ngày trong tháng để gợi ý mức chi tiêu an toàn mỗi ngày cho bạn.'
    },
    {
      icon: 'pie-chart', color: '#3498DB', bg: '#EBF5FB',
      title: '4. Biểu đồ Thống kê',
      desc: 'Biểu đồ ở trang chủ chỉ hiển thị dữ liệu của tháng hiện tại. Để xem tổng quát các tháng trước, hãy chuyển sang tab Thống kê.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hướng dẫn sử dụng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introBox}>
          <Ionicons name="book" size={40} color={COLORS.primary} style={{ marginBottom: 10 }} />
          <Text style={styles.introTitle}>Chào mừng đến với SpendWise!</Text>
          <Text style={styles.introDesc}>Dưới đây là các tính năng chính giúp bạn quản lý tài chính hiệu quả và thông minh hơn.</Text>
        </View>

        {guides.map((item, index) => (
          <View key={index} style={styles.guideCard}>
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.guideTitle}>{item.title}</Text>
              <Text style={styles.guideDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Phiên bản ứng dụng: v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  introBox: { alignItems: 'center', backgroundColor: '#FFF', padding: 25, borderRadius: 24, marginBottom: 25, ...SHADOWS.light },
  introTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  introDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },

  guideCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15, ...SHADOWS.light },
  iconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  guideTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  guideDesc: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' }
});