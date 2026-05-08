import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SHADOWS } from '../utils/constants';

export default function ListScreen({ navigation }) {
  const { transactions, deleteTransaction } = useContext(TransactionContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [dateRange, setDateRange] = useState('all'); 

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const filteredData = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    return transactions
      .filter(item => {
        const matchType = filterType === 'all' ? true : item.type === filterType;
        const searchTarget = `${item.categoryName || ''} ${item.note || ''}`.toLowerCase();
        const matchSearch = searchTarget.includes(searchQuery.toLowerCase().trim());
        
        const itemDate = parseDate(item.date);
        let matchDate = true;
        if (dateRange === 'week') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          matchDate = itemDate >= sevenDaysAgo && itemDate <= now;
        } else if (dateRange === 'month') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          matchDate = itemDate >= thirtyDaysAgo && itemDate <= now;
        }
        return matchType && matchSearch && matchDate;
      })
      .sort((a, b) => b.id - a.id); 
  }, [transactions, searchQuery, filterType, dateRange]);

  const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {
        Keyboard.dismiss();
        navigation.navigate('Edit', { transaction: item });
      }}
    >
      <View style={[styles.typeIndicator, { backgroundColor: item.type === 'income' ? '#2ECC71' : '#E74C3C' }]} />
      <View style={styles.cardContent}>
        <View style={styles.mainInfo}>
          <Text style={styles.categoryName}>{item.categoryName}</Text>
          <Text style={[styles.amountText, { color: item.type === 'income' ? '#2ECC71' : '#E74C3C' }]}>
            {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
          </Text>
        </View>
        <Text style={styles.noteText} numberOfLines={1}>{item.note || 'Không có ghi chú'}</Text>
        <View style={styles.footer}>
           <Text style={styles.dateText}>{item.date}</Text>
           <TouchableOpacity 
              onPress={() => {
                Alert.alert("Xác nhận", "Xóa giao dịch này?", [
                  { text: "Hủy", style: "cancel" },
                  { text: "Xóa", onPress: () => deleteTransaction(item.id), style: "destructive" }
                ]);
              }}
              style={{ padding: 5 }}
           >
              <Ionicons name="trash-outline" size={18} color="#E74C3C" />
           </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử chi tiết</Text>
        
        {/* THANH TÌM KIẾM CỰC NHẠY */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Tìm theo hạng mục, ghi chú..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 5 }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          {['all', 'week', 'month'].map((range) => (
            <TouchableOpacity 
              key={range}
              style={[styles.miniBtn, dateRange === range && styles.miniBtnActive]}
              onPress={() => setDateRange(range)}
            >
              <Text style={[styles.miniText, dateRange === range && styles.textWhite]}>
                {range === 'all' ? 'Tất cả' : range === 'week' ? '7 ngày' : '30 ngày'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tabWrapper}>
        {['all', 'income', 'expense'].map((t) => (
          <TouchableOpacity 
            key={t}
            style={[styles.tab, filterType === t && styles.tabActive]} 
            onPress={() => setFilterType(t)}
          >
            <Text style={[styles.tabText, filterType === t && styles.tabTextActive]}>
              {t === 'all' ? 'Tất cả' : t === 'income' ? 'Thu nhập' : 'Chi tiêu'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled" 
        ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy kết quả</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 15 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#334155', height: '100%' },
  filterRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  miniBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#E2E8F0' },
  miniBtnActive: { backgroundColor: '#3498DB' },
  miniText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  textWhite: { color: '#FFF' },
  tabWrapper: { flexDirection: 'row', marginHorizontal: 20, marginVertical: 15, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#FFF', ...SHADOWS.light },
  tabText: { fontWeight: '700', color: '#64748B', fontSize: 13 },
  tabTextActive: { color: '#3498DB' },
  list: { paddingHorizontal: 20, paddingBottom: 50 },
  card: { backgroundColor: '#FFF', borderRadius: 15, flexDirection: 'row', marginBottom: 12, overflow: 'hidden', ...SHADOWS.light },
  typeIndicator: { width: 6 },
  cardContent: { flex: 1, padding: 15 },
  mainInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' },
  categoryName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  amountText: { fontSize: 16, fontWeight: '900' },
  noteText: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  dateText: { fontSize: 12, color: '#94A3B8' },
  empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8', fontSize: 14 }
});