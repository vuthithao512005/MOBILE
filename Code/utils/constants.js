export const COLORS = {
  // ĐÃ CẬP NHẬT MÀU XANH EMERALD #059669 THEO YÊU CẦU
  primary: '#059669',      // Màu xanh chính cho nút bấm, icon
  primaryDark: '#047857',  // Màu xanh đậm hơn một chút (Dùng cho nền Header để tạo độ sâu)
  primaryLight: '#D1FAE5', // Màu xanh Emerald siêu nhạt (Dùng cho nền icon, label)
  
  danger: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
  dark: '#2C3E50',
  secondary: '#1E293B',    // Màu xanh đen Slate (Dùng cho ô Số dư màu tối)
  
  gray: '#95A5A6',
  lightGray: '#F4F6F8', 
  white: '#FFFFFF',
  background: '#F8F9FA',

  // Các biến logic cho Thu/Chi
  income: '#059669',       // Thu nhập dùng luôn tông xanh Emerald
  expense: '#E74C3C',      // Chi tiêu dùng màu đỏ
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  }
};

export const CATEGORIES = {
  expense: ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Hóa đơn', 'Khác'],
  income: ['Lương', 'Thưởng', 'Khác']
};