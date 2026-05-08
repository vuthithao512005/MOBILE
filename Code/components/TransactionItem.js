import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// ĐỔI LẠI DÙNG BẢN CHUẨN NÀY, KHÔNG DÙNG REANIMATEDSWIPEABLE NỮA
import { Swipeable } from 'react-native-gesture-handler'; 
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../utils/constants';

export default function TransactionItem({ item, onDelete, onPress }) {
  const isExpense = item.type === 'expense';

  const renderRightActions = () => (
    <View style={styles.deleteContainer}>
      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={() => onDelete(item.id)}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={24} color={COLORS.white} />
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable 
      renderRightActions={renderRightActions} 
      friction={2} 
      rightThreshold={40}
      useNativeAnimations={false} // <--- DÒNG NÀY PHÉP THUẬT SẼ CHẶN MỌI LỖI C++
    >
      <View style={styles.cardWrapper}>
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: isExpense ? '#FADBD8' : '#D5F5E3' }]}>
              <Ionicons name={isExpense ? "cart-outline" : "wallet-outline"} size={24} color={isExpense ? COLORS.danger : COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.categoryName} numberOfLines={1}>{item.categoryName || 'Chưa phân loại'}</Text>
              <Text style={styles.noteText} numberOfLines={1}>{item.note || 'Không có ghi chú'}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={[styles.amount, { color: isExpense ? COLORS.danger : COLORS.primary }]}>
              {isExpense ? '-' : '+'}{Number(item.amount).toLocaleString('vi-VN')}đ
            </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

// Giữ nguyên phần styles cũ của file trước...
const styles = StyleSheet.create({
  cardWrapper: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.background },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: 16, ...SHADOWS.light },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  textContainer: { flex: 1 },
  categoryName: { fontSize: 16, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  noteText: { fontSize: 13, color: COLORS.gray },
  rightSection: { alignItems: 'flex-end', justifyContent: 'center' },
  amount: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  dateText: { fontSize: 12, color: COLORS.gray },
  deleteContainer: { width: 90, paddingVertical: 8, paddingRight: 16 },
  deleteBtn: { flex: 1, backgroundColor: COLORS.danger, justifyContent: 'center', alignItems: 'center', borderRadius: 16, ...SHADOWS.light },
  deleteText: { color: COLORS.white, fontWeight: '700', fontSize: 12, marginTop: 4 }
});