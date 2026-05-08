import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SHADOWS } from '../utils/constants';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { transactions } = useContext(TransactionContext);
  const [filterType, setFilterType] = useState('all');
  const [viewDate, setViewDate] = useState(new Date());

  const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate.setMonth(viewDate.getMonth() + offset));
    setViewDate(new Date(newDate));
  };

  const currentMonthLabel = viewDate.getMonth() + 1;

  const filteredTransactions = useMemo(() => {
    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    return transactions.filter(t => {
      const tDate = parseDate(t.date);
      const isSameMonth = tDate.getMonth() === m && tDate.getFullYear() === y;
      const isSameType = filterType === 'all' ? true : t.type === filterType;
      return isSameMonth && isSameType;
    });
  }, [transactions, filterType, viewDate]);

  const monthSummary = useMemo(() => {
    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    const currentMonthTX = transactions.filter(t => {
      const d = parseDate(t.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const income = currentMonthTX.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = currentMonthTX.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions, viewDate]);

  const { income: totalIncome, expense: totalExpense, balance } = monthSummary;
  const isWarning = totalIncome > 0 && (balance / totalIncome) < 0.10;
  const isCritical = balance < 0;

  const chartData = useMemo(() => {
    const dataMap = {};
    const listToProcess = filterType === 'all' 
      ? filteredTransactions.filter(t => t.type === 'expense') 
      : filteredTransactions;
    
    listToProcess.forEach(t => {
      const cat = t.categoryName || 'Khác';
      dataMap[cat] = (dataMap[cat] || 0) + t.amount;
    });

    const palette = ['#1ABC9C', '#3498DB', '#9B59B6', '#E67E22', '#F1C40F', '#E74C3C', '#2ECC71', '#34495E', '#FF9F43', '#AC70FF', '#00D2D3', '#54A0FF', '#5F27CD', '#FF6B6B', '#48DBFB'];
    const result = Object.entries(dataMap).map(([name, amount], index) => ({
      name,
      amount,
      color: palette[index % palette.length],
    })).sort((a, b) => b.amount - a.amount);

    if (filterType === 'all' && balance > 0) {
      result.push({ name: 'Số dư còn lại', amount: balance, color: '#E2E8F0' });
    }
    return result;
  }, [filteredTransactions, filterType, balance]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <View style={styles.headerBackground} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER THIẾT KẾ LẠI: LÀM NỔI BẬT CHỮ & SỐ */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>BÁO CÁO TÀI CHÍNH</Text>
            <Text style={[styles.balanceValue, (isCritical || isWarning) && { color: '#FECACA' }]}>
              {formatMoney(balance)}
            </Text>
            
            {/* Ô chọn tháng: Thu gọn lại, bỏ shadow nặng, thêm viền mảnh */}
            <View style={styles.monthSelectorCompact}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowIcon}>
                <Ionicons name="chevron-back" size={20} color="#334155" />
              </TouchableOpacity>
              
              <View style={styles.dateDisplay}>
                <Ionicons name="calendar-outline" size={16} color="#059669" />
                <Text style={styles.dateLabelText}>Tháng {currentMonthLabel}, {viewDate.getFullYear()}</Text>
              </View>

              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowIcon}>
                <Ionicons name="chevron-forward" size={20} color="#334155" />
              </TouchableOpacity>
            </View>

            {(isCritical || isWarning) && (
              <View style={styles.miniAlert}>
                <Ionicons name="alert-circle" size={14} color="#FFF" />
                <Text style={styles.miniAlertText}>
                   {isCritical ? "Đang chi vượt mức!" : "Ngân sách sắp hết"}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Thu tháng {currentMonthLabel}</Text>
              <Text style={[styles.summaryAmount, {color: '#10B981'}]}>+{formatMoney(totalIncome)}</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Chi tháng {currentMonthLabel}</Text>
              <Text style={[styles.summaryAmount, {color: '#EF4444'}]}>-{formatMoney(totalExpense)}</Text>
            </View>
          </View>

          {/* ... Phần thân dưới giữ nguyên form cũ của bạn ... */}
          <View style={styles.tabContainer}>
            {['all', 'income', 'expense'].map((type) => (
              <TouchableOpacity 
                key={type}
                style={[styles.tabBtn, filterType === type && styles.tabBtnActive]}
                onPress={() => setFilterType(type)}
              >
                <Text style={[styles.tabText, filterType === type && styles.tabTextActive]}>
                  {type === 'all' ? 'Tất cả' : (type === 'income' ? 'Thu nhập' : 'Chi tiêu')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {filterType === 'all' ? `Cơ cấu tài chính tháng ${currentMonthLabel}` : (filterType === 'income' ? `Nguồn thu tháng ${currentMonthLabel}` : `Phân bổ chi tháng ${currentMonthLabel}`)}
            </Text>
            {chartData.length > 0 ? (
              <>
                <View style={styles.chartWrapper}>
                  <PieChart
                    data={chartData}
                    width={screenWidth - 60}
                    height={180}
                    chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
                    accessor={"amount"}
                    backgroundColor={"transparent"}
                    paddingLeft={screenWidth / 4 - 30}
                    hasLegend={false}
                    absolute
                  />
                </View>
                <View style={styles.legendGrid}>
                  {chartData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.legendValue}>{formatMoney(item.amount)}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.emptyText}>Không có dữ liệu.</Text>
            )}
          </View>

          <View style={styles.card}>
             <View style={styles.tableHeaderRow}>
               <Text style={styles.cardTitle}>Chi tiết giao dịch</Text>
               <View style={styles.miniCount}><Text style={styles.miniCountText}>{filteredTransactions.length}</Text></View>
             </View>
             <View style={styles.tableHead}>
               <Text style={[styles.th, { flex: 2 }]}>Hạng mục</Text>
               <Text style={[styles.th, { flex: 2 }]}>Ghi chú</Text>
               <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Số tiền</Text>
             </View>
             {filteredTransactions.length > 0 ? (
               [...filteredTransactions].reverse().map((item, index) => (
                 <View key={index} style={[styles.tr, index % 2 === 0 ? styles.trEven : styles.trOdd ]}>
                   <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                     <View style={[styles.dot, { backgroundColor: item.type === 'income' ? '#2ECC71' : '#E74C3C', width: 6, height: 6, marginRight: 6 }]} />
                     <Text style={styles.tdCategory} numberOfLines={1}>{item.categoryName}</Text>
                   </View>
                   <Text style={[styles.tdNote, { flex: 2 }]} numberOfLines={1}>{item.note || '-'}</Text>
                   <Text style={[styles.tdAmount, { flex: 2, color: item.type === 'income' ? '#2ECC71' : '#E74C3C' }]}>
                     {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
                   </Text>
                 </View>
               ))
             ) : (
               <Text style={styles.emptyTableText}>Chưa có dữ liệu</Text>
             )}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  // Nền xanh đậm hơn để tạo độ sâu
  headerBackground: { 
    position: 'absolute', top: 0, left: 0, right: 0, height: 280, 
    backgroundColor: '#059669', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 
  },
  scrollContent: { paddingHorizontal: 20 },
  header: { alignItems: 'center', paddingTop: 10, paddingBottom: 20 },
  //  BÁO CÁO TÀI CHÍNH 
  headerLabel: { 
    color: '#D1FAE5', fontWeight: '900', fontSize: 15, 
    letterSpacing: 2, textShadowColor: 'rgba(0,0,0,0.1)', textShadowRadius: 2 
  },
  balanceValue: { 
    color: '#FFF', fontSize: 42, fontWeight: '900', 
    marginTop: 5, letterSpacing: -1 
  },
  
  // Thiết kế lại ô chọn tháng: Mỏng, sạch, sang
  monthSelectorCompact: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 8, 
    width: '80%', marginTop: 20, borderWidth: 1, borderColor: '#ECFDF5',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5
  },
  arrowIcon: { padding: 6, backgroundColor: '#F8FAFC', borderRadius: 10 },
  dateDisplay: { flexDirection: 'row', alignItems: 'center' },
  dateLabelText: { color: '#1E293B', fontWeight: '800', fontSize: 15, marginLeft: 6 },

  miniAlert: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 
  },
  miniAlertText: { color: '#FFF', fontWeight: '700', fontSize: 11, marginLeft: 5 },

  summaryCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 20, 
    marginTop: 0, marginBottom: 25, ...SHADOWS.medium 
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '800', marginBottom: 4, textTransform: 'uppercase' },
  summaryAmount: { fontSize: 15, fontWeight: '900' },
  vDivider: { width: 1, backgroundColor: '#F1F5F9', height: '100%' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabBtnActive: { backgroundColor: '#FFF', ...SHADOWS.light },
  tabText: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  tabTextActive: { color: '#059669' },

  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, ...SHADOWS.light },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 15 },
  chartWrapper: { alignItems: 'center', marginVertical: 10 },
  legendGrid: { marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendName: { flex: 1, fontSize: 14, color: '#64748B', fontWeight: '600' },
  legendValue: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  tableHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  miniCount: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  miniCountText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  tableHead: { flexDirection: 'row', backgroundColor: '#F8F9FA', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  th: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  trEven: { backgroundColor: '#FFFFFF' },
  trOdd: { backgroundColor: '#FAFBFC' },
  tdCategory: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  tdNote: { fontSize: 12, color: '#64748B' },
  tdAmount: { fontSize: 13, fontWeight: '800', textAlign: 'right' },
  emptyTableText: { textAlign: 'center', padding: 30, color: '#94A3B8', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontStyle: 'italic', paddingVertical: 20 }
});