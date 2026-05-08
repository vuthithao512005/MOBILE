import * as SQLite from 'expo-sqlite';

let db = null;

// 1. Mở kết nối Database
export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('spendwise_v4.db');
  }
  return db;
};

// 2. Khởi tạo cấu trúc bảng
export const initDB = async () => {
  try {
    const database = await getDB();
    
    // Bật ràng buộc khóa ngoại
    await database.execAsync('PRAGMA foreign_keys = ON;');
    
    // Thực thi tạo các bảng
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT,
        avatar TEXT 
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        categoryName TEXT,
        note TEXT,
        date TEXT,
        user_id INTEGER, 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, 
        value TEXT
      );
    `);

    // Khởi tạo mức ngân sách mặc định 5 triệu nếu chưa có
    await database.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?);',
      ['budget', '5000000']
    );

    console.log('✅ Hệ thống Database SpendWise (v4) & Settings đã sẵn sàng.');
  } catch (error) {
    console.error('❌ Lỗi khởi tạo Database:', error);
  }
};

// 3. CÁC HÀM XỬ LÝ SETTINGS (Dành riêng cho Ngân sách)
export const getSettings = async (key) => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return result ? result.value : null;
  } catch (error) {
    console.error('❌ Lỗi lấy settings:', error);
    return null;
  }
};

export const updateSettings = async (key, value) => {
  try {
    const database = await getDB();
    await database.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value.toString()]
    );
    return true;
  } catch (error) {
    console.error('❌ Lỗi lưu settings:', error);
    return false;
  }
};

// 4. CÁC HÀM XỬ LÝ NGƯỜI DÙNG & GIAO DỊCH
export const updateUserProfile = async (userId, newFullName, newPassword, newAvatar) => {
  try {
    const database = await getDB();
    await database.runAsync(
      'UPDATE users SET fullName = ?, password = ?, avatar = ? WHERE id = ?',
      [newFullName, newPassword, newAvatar, userId]
    );
    return { success: true };
  } catch (error) {
    console.error('❌ Lỗi cập nhật profile:', error);
    return { success: false, error: error.message };
  }
};

export const getTransactionsByUser = async (userId) => {
  try {
    const database = await getDB();
    const allRows = await database.getAllAsync(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC', 
      [userId]
    );
    return allRows;
  } catch (error) {
    console.error('❌ Lỗi lấy giao dịch:', error);
    return [];
  }
};