import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import * as service from '../services/transactionService';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  
  // 1. NGÂN SÁCH (Sẽ được ghi đè bởi dữ liệu từ DB)
  const [monthlyBudget, setMonthlyBudget] = useState(5000000);

  const { user } = useContext(AuthContext);

  // --- MỚI THÊM: Tải ngân sách khi khởi động app ---
useEffect(() => {
    const fetchBudget = async () => {
      try {
        // Thêm một khoảng nghỉ ngắn (khoảng 500ms) để chắc chắn DB đã init xong
        // Hoặc kiểm tra xem bảng đã tồn tại chưa
        const budgetFromDB = await service.getBudget();
        if (budgetFromDB) {
          setMonthlyBudget(budgetFromDB);
        }
      } catch (e) {
        // Nếu lỗi do bảng chưa kịp tạo, chúng ta sẽ thử lại sau 1 giây
        console.log("Đang đợi database khởi tạo...");
        setTimeout(fetchBudget, 1000); 
      }
    };
    fetchBudget();
  }, []);
  // -----------------------------------------------

  const loadData = useCallback(async () => {
    if (!user || !user.id) {
      setTransactions([]);
      return;
    }
    try {
      const data = await service.getTransactions(user.id);
      setTransactions(data);
    } catch (e) { 
      console.error(e); 
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTransaction = async (data) => {
    if (!user || !user.id) return;
    const transactionData = { ...data, user_id: user.id };
    await service.addTransaction(transactionData);
    await loadData();
  };

  const deleteTransaction = async (id) => {
    await service.removeTransaction(id);
    await loadData();
  };

  const editData = async (id, data) => {
    await service.editTransaction(id, data);
    await loadData();
  };

  // 2. CẬP NHẬT HÀM CẬP NHẬT NGÂN SÁCH (Lưu cả vào DB)
  const updateBudget = async (amount) => {
    try {
      await service.saveBudget(amount); // Lưu vĩnh viễn vào máy
      setMonthlyBudget(amount); // Cập nhật trạng thái hiển thị
    } catch (e) {
      console.error("Lỗi không thể lưu ngân sách:", e);
    }
  };

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        loadData, 
        addTransaction, 
        deleteTransaction, 
        editData,
        // 3. ĐƯA DỮ LIỆU NGÂN SÁCH VÀO ĐÂY
        monthlyBudget,
        updateBudget
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};