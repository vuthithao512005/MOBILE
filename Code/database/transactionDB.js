import { getDB } from './db';

// 1. ĐÃ SỬA: Đổi tên hàm và thêm điều kiện lọc WHERE t.user_id = ?
export const getTransactionsByUser = async (userId) => {
  const db = await getDB();
  return await db.getAllAsync(`
    SELECT t.*, c.name as categoryName 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    WHERE t.user_id = ? 
    ORDER BY t.date DESC
  `, [userId]); // Truyền userId vào đây
};

// 2. ĐÃ SỬA: Lấy thêm user_id từ data và đưa vào lệnh INSERT
export const insertTransaction = async (data) => {
  const db = await getDB();
  // Bổ sung lấy biến user_id từ object data
  const { amount, type, category_id, note, date, user_id } = data; 
  return await db.runAsync(
    'INSERT INTO transactions (amount, type, category_id, note, date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [amount, type, category_id, note, date, user_id] // Truyền giá trị vào SQL
  );
};

// Hàm Sửa (Giữ nguyên vì id của giao dịch đã là duy nhất)
export const updateTransactionById = async (id, data) => {
  const db = await getDB();
  const { amount, type, category_id, note, date } = data;
  return await db.runAsync(
    'UPDATE transactions SET amount = ?, type = ?, category_id = ?, note = ?, date = ? WHERE id = ?',
    [amount, type, category_id, note, date, id]
  );
};

// Hàm Xóa (Giữ nguyên)
export const deleteTransactionById = async (id) => {
  const db = await getDB();
  return await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
};
