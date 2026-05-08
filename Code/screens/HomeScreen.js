import React, { useContext, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SHADOWS } from '../utils/constants';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { transactions } = useContext(TransactionContext);
  
  const [showBalance, setShowBalance] = useState(true);
  const [greeting, setGreeting] = useState('Xin chào');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setGreeting('Chào buổi sáng ☀️');
    else if (hour >= 11 && hour < 13) setGreeting('Chào buổi trưa ✨'); 
    else if (hour >= 13 && hour < 18) setGreeting('Chào buổi chiều 🌤️');
    else setGreeting('Chào buổi tối 🌙');
  }, []);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [transactions]);

  const formatMoney = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";

  // BIỂU ĐỒ HIỂN THỊ TOÀN BỘ HẠNG MỤC (Không dùng slice(0,5))
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    expenses.forEach(tx => {
      const catName = tx.categoryName || 'Khác';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + tx.amount;
    });

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    // Bảng màu đa dạng cho nhiều hạng mục
    const palette = [
      COLORS.primary, '#3498DB', '#9B59B6', '#F1C40F', '#E74C3C', 
      '#FF9F43', '#1ABC9C', '#34495E', '#AC70FF', '#FF6B6B'
    ];

    return sorted.map(([name, amount], index) => ({
      name,
      amount,
      color: palette[index % palette.length],
      legendFontColor: "transparent",
    }));
  }, [transactions]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.topBackground} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.userNameText}>{user?.fullName || 'Người dùng'}</Text>
            </View>
            
            {/* FIX AVATAR: Hiển thị ảnh nếu có, nếu không hiện chữ cái đầu */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')} 
              style={styles.avatarWrapper}
            >
               {user?.avatar ? (
                 <Image 
                   source={{ uri: user.avatar }} 
                   style={styles.avatarImg} 
                 />
               ) : (
                 <View style={styles.avatarCircle}>
                    <Text style={styles.avatarChar}>{user?.fullName?.charAt(0).toUpperCase()}</Text>
                 </View>
               )}
            </TouchableOpacity>
          </View>

          <View style={[styles.balanceCard, balance < 0 && {backgroundColor: '#991B1B'}]}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>SỐ DƯ HIỆN TẠI</Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={22} color={COLORS.primaryLight} />
              </TouchableOpacity>
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.balanceValue}>
              {showBalance ? formatMoney(balance) : '****** ₫'}
            </Text>
          </View>

          <View style={styles.actionGrid}>
            {[
              { label: 'Thêm GD', icon: 'add', color: COLORS.primary, bg: '#DCFCE7', route: 'Add' },
              { label: 'Thống kê', icon: 'stats-chart', color: '#3498DB', bg: '#EBF5FB', route: 'Stats' },
              { label: 'Ngân sách', icon: 'wallet', color: '#F59E0B', bg: '#FEF3C7', route: 'Budget' },
              { label: 'Hướng dẫn', icon: 'book', color: '#8B5CF6', bg: '#F3E8FF', route: 'Guide' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.actionItem} onPress={() => item.route && navigation.navigate(item.route)}>
                <View style={[styles.actionIcon, { backgroundColor: item.bg }]}><Ionicons name={item.icon} size={24} color={item.color} /></View>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>TỔNG THU</Text>
              <Text style={[styles.summaryValue, { color: COLORS.primary }]} numberOfLines={1} adjustsFontSizeToFit>
                {showBalance ? formatMoney(totalIncome) : '***'}
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>TỔNG CHI</Text>
              <Text style={[styles.summaryValue, { color: '#DC2626' }]} numberOfLines={1} adjustsFontSizeToFit>
                {showBalance ? formatMoney(totalExpense) : '***'}
              </Text>
            </View>
          </View>

          {chartData.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Phân bổ chi tiêu tổng quát</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={chartData}
                  width={screenWidth * 0.55}
                  height={200}
                  chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                  accessor={"amount"}
                  backgroundColor={"transparent"}
                  paddingLeft={"35"}
                  hasLegend={false}
                  absolute
                />
                <View style={styles.customLegend}>
                  {chartData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText} numberOfLines={1}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
              <TouchableOpacity onPress={() => navigation.navigate('List')}><Text style={[styles.seeAllText, {color: COLORS.primary}]}>Xem tất cả</Text></TouchableOpacity>
            </View>
            {transactions.slice(0, 5).map((item, index) => (
              <TouchableOpacity key={index} style={styles.txRow} onPress={() => navigation.navigate('Edit', { transaction: item })}>
                <View style={[styles.txIcon, {backgroundColor: item.type === 'income' ? '#DCFCE7' : '#FEE2E2'}]}>
                  <Ionicons name={item.type === 'income' ? "arrow-down" : "arrow-up"} size={18} color={item.type === 'income' ? COLORS.primary : '#DC2626'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txCat}>{item.categoryName}</Text>
                  <Text style={styles.txDate}>{item.date}</Text>
                </View>
                <Text style={[styles.txAmt, { color: item.type === 'income' ? COLORS.primary : '#DC2626' }]}>
                  {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 220, backgroundColor: COLORS.primary, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  greetingText: { fontSize: 14, color: COLORS.primaryLight, fontWeight: '600' },
  userNameText: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  
  // STYLE AVATAR ĐÃ ĐƯỢC CẬP NHẬT
  avatarWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.light, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 24 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' },
  avatarChar: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  
  balanceCard: { backgroundColor: '#1E293B', borderRadius: 28, padding: 25, marginBottom: 25, ...SHADOWS.medium, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  balanceLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  balanceValue: { color: '#FFF', fontSize: 38, fontWeight: '900' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionItem: { alignItems: 'center', width: '23%' },
  actionIcon: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8, ...SHADOWS.light },
  actionLabel: { fontSize: 11, fontWeight: '800', color: '#475569' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryBox: { width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 18, ...SHADOWS.light },
  summaryLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '900', marginBottom: 6 },
  summaryValue: { fontSize: 17, fontWeight: '900' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, ...SHADOWS.light },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginBottom: 15 },
  chartContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: -20 },
  customLegend: { flex: 1, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  seeAllText: { fontSize: 13, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  txIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txCat: { fontSize: 16, fontWeight: '700', color: '#334155' },
  txDate: { fontSize: 12, color: '#94A3B8' },
  txAmt: { fontSize: 16, fontWeight: '900' }
});