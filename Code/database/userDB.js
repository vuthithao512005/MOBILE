import { getDB } from './db';

// Hàm Đăng ký
export const registerUser = async (username, password, fullName) => {
  const db = await getDB();
  
  // Kiểm tra xem username đã tồn tại chưa
  const existingUser = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [username]);
  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại!');
  }

  // Thêm người dùng mới
  const result = await db.runAsync(
    'INSERT INTO users (username, password, fullName) VALUES (?, ?, ?)',
    [username, password, fullName]
  );
  return result.lastInsertRowId;
};

// Hàm Đăng nhập
export const loginUser = async (username, password) => {
  const db = await getDB();
  // Tìm người dùng khớp username và password
  const user = await db.getFirstAsync(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  
  if (!user) {
    throw new Error('Sai tên đăng nhập hoặc mật khẩu!');
  }
  return user;
};