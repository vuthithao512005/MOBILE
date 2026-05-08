import React, { useContext, useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, 
  Keyboard, TouchableWithoutFeedback, Alert, Switch, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SHADOWS } from '../utils/constants';

export default function BudgetScreen({ navigation }) {
  const { transactions, monthlyBudget, updateBudget } = useContext(TransactionContext);
  const [newBudget, setNewBudget] = useState(monthlyBudget.toString());
  const [isRolloverEnabled, setIsRolloverEnabled] = useState(false);

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const budgetData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.getDate();
    
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysRemaining = lastDayOfMonth - today + 1;

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevMonthTX = transactions.filter(t => {
      const d = parseDate(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });
    const prevInc = prevMonthTX.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExp = prevMonthTX.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const rawRollover = prevInc - prevExp;

    const spentThisMonth = transactions.filter(t => {
      const d = parseDate(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((s, t) => s + t.amount, 0);

    const totalLimit = isRolloverEnabled ? (monthlyBudget + rawRollover) : monthlyBudget;
    const remaining = Math.max(totalLimit - spentThisMonth, 0);
    const percent = Math.round((spentThisMonth / totalLimit) * 100) || 0;

    const dailySuggested = remaining > 0 ? Math.floor(remaining / daysRemaining) : 0;

    return { 
      rawRollover, spentThisMonth, totalLimit, remaining, 
      percent, monthName: currentMonth + 1, prevMonthName: prevMonth + 1,
      dailySuggested, daysRemaining
    };
  }, [transactions, monthlyBudget, isRolloverEnabled]);

  const { 
    rawRollover, spentThisMonth, totalLimit, remaining, 
    percent, monthName, prevMonthName, dailySuggested, daysRemaining 
  } = budgetData;

  const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";

  const handleToggle = (value) => {
    if (value && rawRollover < 0) {
      Alert.alert(
        "Xác nhận trừ nợ",
        `Tháng ${prevMonthName} bạn âm ${formatMoney(Math.abs(rawRollover))}. Trừ vào hạn mức tháng này?`,
        [
          { text: "Để sau", onPress: () => setIsRolloverEnabled(false), style: "cancel" },
          { text: "Đồng ý", onPress: () => setIsRolloverEnabled(true) }
        ]
      );
    } else {
      setIsRolloverEnabled(value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            
            <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <Ionicons name="arrow-back" size={22} color="#1E293B" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Ngân sách tháng {monthName}</Text>
            </View>

            <ScrollView 
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              
              <View style={[styles.mainCard, percent >= 100 && { backgroundColor: '#7F1D1D' }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>ĐÃ CHI TIÊU</Text>
                  <Text style={styles.percentText}>{percent}%</Text>
                </View>
                <Text style={styles.spentAmount} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(spentThisMonth)}</Text>
                
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${percent > 100 ? 100 : percent}%`, backgroundColor: percent >= 100 ? '#FCA5A1' : COLORS.primary }]} />
                </View>
                
                <View style={styles.cardFooter}>
                  <View style={styles.footerRow}>
                     <Text style={styles.footerLabel}>Hạn mức:</Text>
                     <Text style={styles.footerValue}>{formatMoney(totalLimit)}</Text>
                  </View>
                  <View style={styles.footerRow}>
                     <Text style={styles.footerLabel}>Còn lại:</Text>
                     <Text style={[styles.footerValue, { fontSize: 18, color: percent >= 100 ? '#FCA5A1' : '#FFF' }]}>
                        {percent >= 100 ? "Hết ngân sách" : formatMoney(remaining)}
                     </Text>
                  </View>
                </View>
              </View>

              {/* THẺ GỢI Ý CHI TIÊU NGÀY - GỌN GÀNG HƠN */}
              <View style={styles.dailyCard}>
                <View style={styles.dailyHeader}>
                  <Ionicons name="flash" size={16} color={COLORS.primary} />
                  <Text style={styles.dailyTitle}>GỢI Ý CHI TIÊU</Text>
                </View>
                <Text style={styles.dailyAmount}>
                    {formatMoney(dailySuggested)}<Text style={styles.perDay}>/ngày</Text>
                </Text>
                <Text style={styles.dailyHint}>Duy trì mức này trong {daysRemaining} ngày tới để không vượt hạn mức.</Text>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingRow}>
                  <View style={[styles.statusIcon, { backgroundColor: rawRollover >= 0 ? '#E8F8F5' : '#FDEDEC' }]}>
                    <Ionicons name={rawRollover >= 0 ? "checkmark-circle" : "alert-circle"} size={22} color={rawRollover >= 0 ? "#2ECC71" : "#E74C3C"} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.settingLabel}>Tháng {prevMonthName}</Text>
                    <Text style={[styles.settingValue, { color: rawRollover >= 0 ? '#27AE60' : '#C0392B' }]}>
                      {rawRollover >= 0 ? `Dư +${formatMoney(rawRollover)}` : `Âm -${formatMoney(Math.abs(rawRollover))}`}
                    </Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
                    thumbColor={"#FFF"}
                    onValueChange={handleToggle}
                    value={isRolloverEnabled}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // Thu nhỏ switch cho mượt
                  />
                </View>
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Cài đặt hạn mức tháng</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={newBudget}
                    onChangeText={setNewBudget}
                    placeholder="Nhập số tiền..."
                  />
                  <TouchableOpacity style={styles.saveBtn} onPress={() => {
                    updateBudget(parseFloat(newBudget));
                    Alert.alert("Thông báo", "Đã cập nhật hạn mức!");
                    Keyboard.dismiss();
                  }}>
                    <Text style={styles.saveBtnText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginLeft: 12 },
  
  mainCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, ...SHADOWS.medium },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  percentText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  spentAmount: { color: '#FFF', fontSize: 32, fontWeight: '900', marginVertical: 8 },
  progressBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, marginVertical: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  footerLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  footerValue: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  dailyCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginTop: 15, ...SHADOWS.light, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  dailyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dailyTitle: { fontSize: 11, fontWeight: '800', color: '#64748B', marginLeft: 6 },
  dailyAmount: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  perDay: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
  dailyHint: { fontSize: 12, color: '#94A3B8', marginTop: 5 },

  settingCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginTop: 15, ...SHADOWS.light },
  settingRow: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  settingValue: { fontSize: 15, fontWeight: '800' },
  
  inputCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginTop: 15, ...SHADOWS.light },
  inputLabel: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 12, fontSize: 16, fontWeight: '700', color: '#1E293B' },
  saveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, marginLeft: 8 },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 }
});