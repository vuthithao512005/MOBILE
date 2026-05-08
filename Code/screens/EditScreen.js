import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SHADOWS } from '../utils/constants';

// Danh sách mặc định
const DEFAULT_EXPENSE_CATS = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Hóa đơn', 'Giải trí', 'Sức khỏe', 'Khác'];
const DEFAULT_INCOME_CATS = ['Tiền lương', 'Tiền thưởng', 'Đầu tư', 'Bán đồ', 'Khác'];

export default function EditScreen({ route, navigation }) {
  const { transaction } = route.params;
  const { editData } = useContext(TransactionContext);
  
  // Xử lý tai thỏ
  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 50 : 20);

  const oldCategory = transaction.categoryName || transaction.category || '';

  const [type, setType] = useState(transaction.type || 'expense');
  const [amount, setAmount] = useState(transaction.amount ? transaction.amount.toString() : '');
  const [category, setCategory] = useState(oldCategory);
  const [note, setNote] = useState(transaction.note || '');
  const [date, setDate] = useState(transaction.date || new Date().toISOString().split('T')[0]);

  const [expenseCats, setExpenseCats] = useState(DEFAULT_EXPENSE_CATS);
  const [incomeCats, setIncomeCats] = useState(DEFAULT_INCOME_CATS);

  useEffect(() => {
    if (transaction.type === 'expense' && oldCategory && !DEFAULT_EXPENSE_CATS.includes(oldCategory)) {
      setExpenseCats([oldCategory, ...DEFAULT_EXPENSE_CATS]);
    }
    if (transaction.type === 'income' && oldCategory && !DEFAULT_INCOME_CATS.includes(oldCategory)) {
      setIncomeCats([oldCategory, ...DEFAULT_INCOME_CATS]);
    }
  }, []);

  const currentCategories = type === 'expense' ? expenseCats : incomeCats;

  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (!category) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục (Hạng mục)');
      return;
    }

    const updatedTransaction = {
      amount: parseFloat(amount),
      type,
      categoryName: category,
      note,
      date
    };

    await editData(transaction.id, updatedTransaction);
    Alert.alert('Thành công', 'Đã cập nhật giao dịch!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: safeTopPadding }]}>
      {/* BAO BỌC BẰNG KEYBOARD AVOIDING VIEW ĐỂ CHỐNG CHE BÀN PHÍM */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            
            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Sửa giao dịch</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              
              {/* TAB CHỌN LOẠI */}
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabBtn, type === 'expense' && styles.tabExpenseActive]}
                  onPress={() => { setType('expense'); setCategory(''); }}
                >
                  <Text style={[styles.tabText, type === 'expense' && styles.textWhite]}>Chi Tiêu</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabBtn, type === 'income' && styles.tabIncomeActive]}
                  onPress={() => { setType('income'); setCategory(''); }}
                >
                  <Text style={[styles.tabText, type === 'income' && styles.textWhite]}>Thu Nhập</Text>
                </TouchableOpacity>
              </View>

              {/* NHẬP SỐ TIỀN */}
              <Text style={styles.inputLabel}>SỐ TIỀN CHỈNH SỬA</Text>
              <View style={styles.amountContainer}>
                <Ionicons name="cash-outline" size={28} color="#94A3B8" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.amountInput}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                />
                <Text style={styles.currencyText}>đ</Text>
              </View>

              {/* CHỌN HẠNG MỤC */}
              <Text style={styles.inputLabel}>HẠNG MỤC</Text>
              <View style={styles.categoryWrapper}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {currentCategories.map((cat, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.catChip, category === cat && (type === 'expense' ? styles.catChipExpense : styles.catChipIncome)]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.catText, category === cat && styles.textWhite]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* NHẬP GHI CHÚ */}
              <Text style={styles.inputLabel}>GHI CHÚ CHI TIẾT</Text>
              <View style={styles.noteContainer}>
                <Ionicons name="create-outline" size={24} color="#94A3B8" style={{ marginTop: 2, marginRight: 10 }} />
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Nhập ghi chú (Không bắt buộc)..."
                  multiline
                />
              </View>

              {/* NHẬP NGÀY THÁNG */}
              <Text style={styles.inputLabel}>NGÀY GIAO DỊCH (DD/MM/YYYY)</Text>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={24} color="#94A3B8" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.dateInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="Ví dụ: 25/04/2026"
                />
              </View>

              {/* NÚT LƯU */}
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: type === 'income' ? '#2ECC71' : '#E74C3C' }]} 
                onPress={handleSave}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              </TouchableOpacity>

            </ScrollView>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 16, padding: 5, marginBottom: 25 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabExpenseActive: { backgroundColor: '#E74C3C', ...SHADOWS.light },
  tabIncomeActive: { backgroundColor: '#2ECC71', ...SHADOWS.light },
  tabText: { fontSize: 15, fontWeight: '800', color: '#64748B' },
  textWhite: { color: '#FFF' },
  inputLabel: { fontSize: 13, fontWeight: '800', color: '#64748B', marginBottom: 10, marginTop: 10, letterSpacing: 0.5 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E2E8F0', borderRadius: 20, paddingHorizontal: 20, marginBottom: 20 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '900', color: '#1E293B', paddingVertical: 15 },
  currencyText: { fontSize: 22, fontWeight: '800', color: '#64748B' },
  categoryWrapper: { height: 50, marginBottom: 20 },
  catChip: { backgroundColor: '#E2E8F0', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 20, marginRight: 10, height: 40 },
  catChipExpense: { backgroundColor: '#E74C3C' },
  catChipIncome: { backgroundColor: '#2ECC71' },
  catText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  noteContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 20, ...SHADOWS.light },
  noteInput: { flex: 1, fontSize: 15, color: '#1E293B', minHeight: 60, textAlignVertical: 'top' },
  dateContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 30, ...SHADOWS.light },
  dateInput: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '600' },
  saveBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 20, ...SHADOWS.medium },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' }
});