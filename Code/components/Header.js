import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/constants';

export default function Header({ title, subtitle, showBack = false, rightIcon, onRightPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Nút Back (Chỉ hiển thị khi truyền prop showBack={true}) */}
      {showBack ? (
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.dark} />
        </TouchableOpacity>
      ) : (
        // View trống để cân bằng layout nếu không có nút Back
        <View style={styles.placeholder} /> 
      )}

      {/* Cụm Tiêu đề chính và phụ */}
      <View style={styles.textContainer}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Nút bên phải tùy chọn (Ví dụ: Nút bộ lọc, cài đặt...) */}
      {rightIcon ? (
        <TouchableOpacity 
          style={styles.iconButtonRight} 
          onPress={onRightPress}
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon} size={24} color={COLORS.dark} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: COLORS.background, // Hoặc COLORS.white tùy màu nền bạn thích
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -8, // Kéo nhẹ sang trái để icon thẳng hàng với viền mép
  },
  iconButtonRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: -8,
  },
  placeholder: {
    width: 40, // Giữ chỗ để cụm Text luôn ở chính giữa (center)
  },
  textContainer: {
    flex: 1,
    alignItems: 'center', // Căn giữa nội dung
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 2,
    fontWeight: '500',
    textTransform: 'uppercase', // Chữ hoa tạo cảm giác sang trọng
    letterSpacing: 1, // Giãn cách chữ
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
  }
});