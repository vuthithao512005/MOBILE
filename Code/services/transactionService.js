import { getDB, getSettings, updateSettings } from '../database/db';

// --- PHẦN NGÂN SÁCH (MỚI THÊM) ---

// Lấy hạn mức ngân sách từ Database
export const getBudget = async () => {
  const value = await getSettings('budget');
  return value ? parseFloat(value) : 5000000; // Trả về 5tr nếu chưa có dữ liệu
};

// Lưu hạn mức ngân sách vào Database
export const saveBudget = async (amount) => {
  return await updateSettings('budget', amount.toString());
};


// --- PHẦN GIAO DỊCH (GIỮ NGUYÊN) ---

// Lấy danh sách giao dịch theo user
export const getTransactions = async (userId) => {
  const database = await getDB();
  // Mẹo: Sắp xếp theo id DESC để cái mới nhất luôn lên đầu chuẩn xác hơn date
  return await database.getAllAsync(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC', 
    [userId]
  );
};

// Thêm giao dịch mới
export const addTransaction = async (data) => {
  const database = await getDB();
  await database.runAsync(
    'INSERT INTO transactions (amount, type, categoryName, note, date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [data.amount, data.type, data.categoryName, data.note, data.date, data.user_id]
  );
};

// Xóa giao dịch
export const removeTransaction = async (id) => {
  const database = await getDB();
  await database.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
};

// Cập nhật giao dịch
export const editTransaction = async (id, data) => {
  const database = await getDB();
  await database.runAsync(
    'UPDATE transactions SET amount = ?, type = ?, categoryName = ?, note = ?, date = ? WHERE id = ?',
    [data.amount, data.type, data.categoryName, data.note, data.date, id]
  );
};