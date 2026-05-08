import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SHADOWS } from '../utils/constants';

// Cấu trúc danh mục tiêu chuẩn
const EXPENSE_CATEGORIES = [
  { name: 'Ăn uống', icon: 'fast-food' }, { name: 'Di chuyển', icon: 'car' },
  { name: 'Hóa đơn', icon: 'document-text' }, { name: 'Mua sắm', icon: 'bag-handle' },
  { name: 'Giải trí', icon: 'game-controller' }, { name: 'Sức khỏe', icon: 'medkit' },
  { name: 'Giáo dục', icon: 'school' }, { name: 'Làm đẹp', icon: 'cut' },
  { name: 'Gia đình', icon: 'home' }, { name: 'Khác', icon: 'grid' },
];

const INCOME_CATEGORIES = [
  { name: 'Tiền lương', icon: 'cash' }, { name: 'Tiền thưởng', icon: 'gift' },
  { name: 'Bán hàng', icon: 'pricetags' }, { name: 'Đầu tư', icon: 'trending-up' },
  { name: 'Lãi tiết kiệm', icon: 'leaf' }, { name: 'Được tặng', icon: 'heart' },
  { name: 'Khác', icon: 'grid' },
];

export default function AddScreen({ navigation }) {
  const { addTransaction, transactions } = useContext(TransactionContext);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(''); 
  const [note, setNote] = useState('');

  useEffect(() => {
    const list = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    setCategory(list[0].name);
  }, [type]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) return Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
    if (!category) return Alert.alert('Lỗi', 'Vui lòng chọn danh mục');

    const success = await addTransaction({
      amount: parseFloat(amount),
      type,
      categoryName: category,
      note,
      date: new Date().toLocaleDateString('vi-VN') 
    });

    if (success !== false) {
      Alert.alert('Thành công', 'Đã lưu giao dịch mới!');
      setAmount(''); 
      setNote('');
      setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0].name : INCOME_CATEGORIES[0].name);
    }
  };

  const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Thêm Giao Dịch</Text>
          </View>

          {/* Form Nhập Liệu theo kiểu truyền thống */}
          <View style={styles.formCard}>
            
            {/* 1. Nút Thu / Chi */}
            <View style={styles.typeSwitcher}>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]}
                onPress={() => setType('expense')} activeOpacity={0.8}
              >
                <Text style={[styles.typeText, type === 'expense' && styles.textWhite]}>Chi Tiêu</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]}
                onPress={() => setType('income')} activeOpacity={0.8}
              >
                <Text style={[styles.typeText, type === 'income' && styles.textWhite]}>Thu Nhập</Text>
              </TouchableOpacity>
            </View>

            {/* 2. Nhập số tiền */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số tiền</Text>
              <View style={styles.amountInputWrapper}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Text style={styles.currency}>VNĐ</Text>
              </View>
            </View>

            {/* 3. Chọn Danh mục */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Danh mục</Text>
              <View style={styles.chipContainer}>
                {currentCategories.map((item, index) => {
                  const isSelected = category === item.name;
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={[
                        styles.chip, 
                        isSelected && (type === 'expense' ? styles.chipSelectedExpense : styles.chipSelectedIncome)
                      ]}
                      onPress={() => setCategory(item.name)}
                    >
                      <Ionicons 
                        name={item.icon} 
                        size={16} 
                        color={isSelected ? '#fff' : COLORS.gray} 
                        style={{ marginRight: 6 }} 
                      />
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Ghi chú */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ghi chú (Tùy chọn)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập chi tiết thêm..."
                placeholderTextColor={COLORS.gray}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* 5. Nút Lưu */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Lưu Giao Dịch</Text>
            </TouchableOpacity>
          </View>

          {/* Bảng Giao Dịch Vừa Thực Hiện */}
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Vừa thêm gần đây</Text>
            <View style={styles.recentCard}>
              {transactions.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>
              ) : (
                transactions.slice(0, 4).map((item) => (
                  <View key={item.id.toString()} style={styles.recentItem}>
                    <View style={[styles.iconBox, {backgroundColor: item.type === 'income' ? '#ECFDF5' : '#FEF2F2'}]}>
                      <Ionicons name={item.type === 'income' ? "arrow-down" : "arrow-up"} size={18} color={item.type === 'income' ? COLORS.income : COLORS.expense} />
                    </View>
                    <View style={styles.recentInfo}>
                      <Text style={styles.recentCat}>{item.categoryName || 'Khác'}</Text>
                      <Text style={styles.recentDate}>{item.date}</Text>
                    </View>
                    <Text style={[styles.recentAmount, {color: item.type === 'income' ? COLORS.income : COLORS.expense}]}>
                      {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingBottom: 100 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.dark },
  
  formCard: { backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 24, padding: 20, ...SHADOWS.medium },
  
  typeSwitcher: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 5, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  typeBtnActiveExpense: { backgroundColor: COLORS.expense, ...SHADOWS.light },
  typeBtnActiveIncome: { backgroundColor: COLORS.income, ...SHADOWS.light },
  typeText: { fontSize: 15, fontWeight: '700', color: COLORS.gray },
  textWhite: { color: COLORS.white },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.dark, marginBottom: 10 },
  amountInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '800', color: COLORS.dark, paddingVertical: 12 },
  currency: { fontSize: 18, fontWeight: '700', color: COLORS.gray },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  chipSelectedExpense: { backgroundColor: COLORS.expense, borderColor: COLORS.expense },
  chipSelectedIncome: { backgroundColor: COLORS.income, borderColor: COLORS.income },
  chipText: { fontSize: 14, fontWeight: '600', color: COLORS.gray },
  chipTextSelected: { color: COLORS.white },

  textInput: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 16, color: COLORS.dark, borderWidth: 1, borderColor: '#E2E8F0' },
  saveBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 5, ...SHADOWS.medium },
  saveBtnText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },

  recentSection: { paddingHorizontal: 20, marginTop: 25 },
  recentTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 12 },
  recentCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 15, ...SHADOWS.light },
  emptyText: { textAlign: 'center', color: COLORS.gray, fontStyle: 'italic', paddingVertical: 10 },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  iconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  recentInfo: { flex: 1 },
  recentCat: { fontSize: 16, fontWeight: '600', color: COLORS.dark },
  recentDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  recentAmount: { fontSize: 15, fontWeight: '700' }
});