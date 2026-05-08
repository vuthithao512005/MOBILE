import React, { createContext, useState } from 'react';
import * as userDB from '../database/userDB';
import { getDB } from '../database/db'; // Import thêm hàm kết nối database

// 1. Khởi tạo Context
export const AuthContext = createContext();

// 2. Tạo Provider để bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  // Hàm cập nhật thông tin cá nhân (Đã sửa lại cú pháp chuẩn expo-sqlite)
  const updateUserInfo = async (newName, newPassword, newAvatar) => {
    try {
      const database = await getDB();
      // Chạy lệnh Update
      await database.runAsync(
        'UPDATE users SET fullName = ?, password = ?, avatar = ? WHERE id = ?',
        [newName, newPassword, newAvatar, user.id]
      );
      
      // Cập nhật lại state trên app ngay lập tức
      setUser({ ...user, fullName: newName, password: newPassword, avatar: newAvatar });
      return { success: true };
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      return { success: false, message: error.message };
    }
  };

  // Hàm xóa tài khoản (Đã đưa ra ngoài, đứng ngang hàng)
  const deleteAccount = async () => {
    try {
      const database = await getDB();
      // Xóa user khỏi database (ON DELETE CASCADE sẽ tự động xóa luôn lịch sử giao dịch)
      await database.runAsync('DELETE FROM users WHERE id = ?', [user.id]);
      
      // Đăng xuất và xóa state
      setUser(null); 
      return { success: true };
    } catch (error) {
      console.error("Lỗi xóa tài khoản:", error);
      return { success: false };
    }
  };

  // Hàm xử lý Đăng nhập
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const userData = await userDB.loginUser(username, password);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý Đăng ký
  const register = async (username, password, fullName) => {
    setIsLoading(true);
    try {
      await userDB.registerUser(username, password, fullName);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm Đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isLoading,
        updateUserInfo, // Đã bổ sung vào đây để ProfileScreen gọi được
        deleteAccount   // Đã bổ sung vào đây
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};