# ỨNG DỤNG QUẢN LÝ CHI TIÊU CÁ NHÂN - SPENDWISE
## Đồ án môn: Lập trình trên thiết bị di động (React Native)

---

# 📋 MỤC LỤC

## 📌 PHẦN 1: PHÁC THẢO ĐỀ TÀI

1.1. [Tên ứng dụng](#11-tên-ứng-dụng)  
1.2. [Mục tiêu](#12-mục-tiêu)  
1.3. [Đối tượng sử dụng](#13-đối-tượng-sử-dụng)  
1.4. [Công nghệ sử dụng](#14-công-nghệ-sử-dụng)  
1.5. [Nền tảng hỗ trợ](#15-nền-tảng-hỗ-trợ)  

---

## 📋 PHẦN 2: ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)

2.1. [Yêu cầu chức năng](#21-yêu-cầu-chức-năng)  
  2.1.1. [Quản lý giao dịch](#211-quản-lý-giao-dịch-transaction-management)  
  2.1.2. [Quản lý danh mục](#212-quản-lý-danh-mục-category-management)  
  2.1.3. [Thống kê & Biểu đồ](#213-thống-kê--biểu-đồ-statistics)  
  2.1.4. [Ngân sách & Cảnh báo](#214-ngân-sách--cảnh-báo-budget--alert)  
  2.1.5. [Cài đặt & Dữ liệu](#215-cài-đặt--dữ-liệu-settings)  

2.2. [Yêu cầu phi chức năng](#22-yêu-cầu-phi-chức-năng)  

---

## 🗂️ PHẦN 3: SƠ ĐỒ THƯ MỤC 

3.1. [Cấu trúc thư mục dự án](#-4x-cấu-trúc-thư-mục-dự-án)  

---

## 🗄️ PHẦN 4: CƠ SỞ DỮ LIỆU

4.1. [Sơ đồ quan hệ](#41-sơ-đồ-quan-hệ)  
4.2. [Chi tiết các bảng](#42-chi-tiết-các-bảng)  

---

## 🔄 PHẦN 5: LUỒNG XỬ LÝ

5.1. [Luồng thêm giao dịch](#51-luồng-thêm-giao-dịch)  

---


## 📌 PHẦN 1: PHÁC THẢO ĐỀ TÀI

### 1.1. Tên ứng dụng
**SpendWise** – Quản lý chi tiêu thông minh
- Ứng dụng quản lý chi tiêu được phát triển bằng React Native sử dụng nền tảng Expo nhằm hỗ trợ xây dựng ứng dụng đa nền tảng (Android và iOS). Hệ thống sử dụng SQLite (thông qua Expo SQLite) để lưu trữ dữ liệu cục bộ, đảm bảo khả năng hoạt động offline.

- Kiến trúc ứng dụng được tổ chức theo mô hình phân lớp bao gồm: giao diện (screens), quản lý trạng thái (Context API), lớp xử lý nghiệp vụ (services) và lớp truy xuất dữ liệu (database). Điều hướng trong ứng dụng được реализ bởi thư viện React Navigation với sự kết hợp giữa Bottom Tab Navigator và Stack Navigator.

- Ngoài ra, ứng dụng sử dụng React Native Paper để xây dựng giao diện người dùng theo chuẩn Material Design, kết hợp với Expo Vector Icons để tăng tính trực quan.

### 1.2. Mục tiêu
Xây dựng ứng dụng di động giúp người dùng:
- Ghi chép thu nhập và chi tiêu hàng ngày
- Phân loại giao dịch theo danh mục
- Thống kê trực quan bằng biểu đồ
- Cảnh báo khi vượt ngân sách từng danh mục
- Hoạt động offline hoàn toàn, dữ liệu lưu trữ cục bộ

### 1.3. Đối tượng sử dụng
- Sinh viên, người đi làm, hộ gia đình
- Người muốn kiểm soát tài chính cá nhân

### 1.4. Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| React Native (Expo) | Framework chính |
| React Navigation | Điều hướng màn hình |
| Context API + useReducer | Quản lý state toàn cục |
| SQLite (expo-sqlite) | Lưu trữ dữ liệu offline |
| AsyncStorage | Lưu cài đặt, token |
| react-native-chart-kit | Vẽ biểu đồ thống kê |
| react-native-vector-icons | Icon danh mục |
| react-native-paper | UI components (modal, button, input) |

### 1.5. Nền tảng hỗ trợ
- **iOS** (từ version 12.0 trở lên)
- **Android** (từ version 5.0 trở lên)
- Hỗ trợ cả 2 chế độ: sáng và tối (Dark mode)

---

## 📋 PHẦN 2: ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)

### 2.1. Yêu cầu chức năng

#### 2.1.1. Quản lý giao dịch (Transaction Management)

| Mã | Chức năng | Mô tả chi tiết | Ưu tiên |
|----|-----------|----------------|---------|
| TC01 | Thêm giao dịch | Người dùng nhập: số tiền, danh mục (dropdown), ghi chú (text), ngày (date picker), loại (thu/chi). Bắt buộc nhập số tiền > 0. | Cao |
| TC02 | Sửa giao dịch | Nhấn vào giao dịch trong danh sách → hiện form đã điền sẵn → cập nhật. | Cao |
| TC03 | Xóa giao dịch | Cảnh báo xác nhận trước khi xóa. Xóa vĩnh viễn khỏi database. | Cao |
| TC04 | Xem danh sách giao dịch | Hiển thị theo ngày giảm dần. Mỗi item hiển thị: icon danh mục, tên, số tiền (màu đỏ nếu chi, xanh nếu thu), ngày. | Cao |
| TC05 | Lọc giao dịch | Lọc theo: khoảng thời gian (tuần/tháng/tùy chỉnh), danh mục, loại giao dịch. | Trung bình |
| TC06 | Tìm kiếm giao dịch | Tìm theo nội dung ghi chú hoặc tên danh mục. | Trung bình |

#### 2.1.2. Quản lý danh mục (Category Management)

| Mã | Chức năng | Mô tả chi tiết | Ưu tiên |
|----|-----------|----------------|---------|
| CM01 | Danh mục mặc định | Khởi tạo 8 danh mục: Ăn uống, Di chuyển, Hóa đơn, Mua sắm, Giải trí, Sức khỏe, Lương, Tiền thưởng. Mỗi danh mục có icon, màu sắc, loại (thu/chi). | Cao |
| CM02 | Thêm danh mục | Người dùng nhập tên, chọn icon, chọn màu, chọn loại (thu/chi). | Cao |
| CM03 | Sửa danh mục | Chỉnh sửa tên, icon, màu, loại. | Cao |
| CM04 | Xóa danh mục | Kiểm tra nếu có giao dịch đang dùng danh mục này → cảnh báo và đề xuất chuyển sang danh mục khác hoặc không cho xóa. | Cao |
| CM05 | Hiển thị danh sách danh mục | Grid 2 cột, mỗi item hiển thị icon + tên + loại (thu/chi). | Cao |

#### 2.1.3. Thống kê & Biểu đồ (Statistics)

| Mã | Chức năng | Mô tả chi tiết | Ưu tiên |
|----|-----------|----------------|---------|
| ST01 | Tổng quan đầu trang | Hiển thị: Tổng thu tháng, Tổng chi tháng, Số dư (thu - chi). | Cao |
| ST02 | Biểu đồ tròn chi tiêu | Biểu diễn % chi tiêu theo từng danh mục chi. Nhấn vào phần tử → hiển thị số tiền tương ứng. | Cao |
| ST03 | Biểu đồ cột thu-chi | So sánh thu và chi theo từng ngày trong tuần hiện tại hoặc theo tháng. | Trung bình |
| ST04 | Top danh mục chi nhiều nhất | Hiển thị top 3 danh mục chi tiêu cao nhất trong tháng. | Trung bình |
| ST05 | Thống kê theo tháng | Chọn tháng/năm khác nhau để xem lại dữ liệu cũ. | Trung bình |

#### 2.1.4. Ngân sách & Cảnh báo (Budget & Alert)

| Mã | Chức năng | Mô tả chi tiết | Ưu tiên |
|----|-----------|----------------|---------|
| BD01 | Đặt ngân sách cho danh mục chi | Mỗi danh mục (loại chi) có thể đặt hạn mức / tháng. | Cao |
| BD02 | Hiển thị tiến độ chi tiêu | Progress bar hiển thị % đã chi so với ngân sách. | Cao |
| BD03 | Cảnh báo | Khi chi tiêu đạt 80% ngân sách → thông báo (toast/alert). Khi vượt 100% → thông báo đỏ. | Cao |
| BD04 | Sửa/xóa ngân sách | Cho phép cập nhật hoặc xóa hạn mức. | Trung bình |

#### 2.1.5. Cài đặt & Dữ liệu (Settings)

| Mã | Chức năng | Mô tả chi tiết | Ưu tiên |
|----|-----------|----------------|---------|
| STG01 | Đơn vị tiền tệ | Chọn VND hoặc USD, định dạng số tự động. | Trung bình |
| STG02 | Xuất báo cáo | Xuất danh sách giao dịch ra file CSV/JSON, có thể chọn khoảng thời gian. | Thấp |
| STG03 | Sao lưu & khôi phục | Sao lưu toàn bộ dữ liệu (transaction + category + budget) ra file JSON. Khôi phục từ file. | Thấp |
| STG04 | Xóa toàn bộ dữ liệu | Xóa sạch database, reset về trạng thái ban đầu (có xác nhận). | Trung bình |
| STG05 | Dark mode | Chuyển đổi giao diện sáng/tối. | Trung bình |

### 2.2. Yêu cầu phi chức năng

| Mã | Yêu cầu | Mô tả | Tiêu chí đánh giá |
|----|---------|-------|-------------------|
| NF01 | Hiệu năng | Thời gian load danh sách giao dịch < 1s với 1000 bản ghi | Đo bằng console.time |
| NF02 | Offline | Ứng dụng hoạt động hoàn toàn không cần internet | Kiểm tra chế độ máy bay |
| NF03 | UX/UI | Giao diện tối giản, thân thiện, tương thích cả iOS và Android | Kiểm tra trên 2 nền tảng |
| NF04 | Bảo mật | Không lưu mật khẩu dạng plain text (nếu có đăng nhập sau này) | Mã nguồn không có password rõ |
| NF05 | Dung lượng | App size < 50MB | Kiểm tra sau khi build |
| NF06 | Tương thích | Hoạt động trên Android 5.0+ và iOS 12.0+ | Test trên máy ảo/thiết bị thật |

---

## 🗂️ PHẦN 3: SƠ ĐỒ THƯ MỤC CHI TIẾT
## 📁 4.x. Cấu trúc thư mục dự án

```text
spendwise/
├── .expo/                # cấu hình Expo
├── .gitignore
├── app.json             # cấu hình app (tên, icon, splash)
├── package.json
├── babel.config.js
├── App.js               # entry point (bọc Context + Navigation)
│
├── src/
│ ├── assets/            # tài nguyên (icon, font, ảnh)
│ │ ├── icons/
│ │ ├── fonts/
│ │ └── splash.png
│ │
│ ├── components/        # component tái sử dụng
│ │ ├── common/          # button, input, header...
│ │ ├── transactions/    # UI giao dịch
│ │ ├── categories/      # UI danh mục
│ │ ├── budgets/         # UI ngân sách
│ │ ├── charts/          # biểu đồ
│ │ └── modals/          # popup, date picker
│ │
│ ├── screens/           # màn hình chính
│ │ ├── HomeScreen.js
│ │ ├── TransactionListScreen.js
│ │ ├── AddEditTransactionScreen.js
│ │ ├── CategoryManageScreen.js
│ │ ├── StatsScreen.js
│ │ ├── BudgetScreen.js
│ │ └── SettingScreen.js
│ │
│ ├── navigation/        # điều hướng
│ │ ├── AppNavigator.js
│ │ ├── RootStack.js
│ │ └── linking.js
│ │
│ ├── context/           # quản lý state (Context API)
│ │ ├── TransactionContext.js
│ │ ├── CategoryContext.js
│ │ ├── BudgetContext.js
│ │ ├── SettingsContext.js
│ │ └── AppContext.js
│ │
│ ├── services/          # xử lý dữ liệu
│ │ ├── database/        # SQL + migration
│ │ ├── sqlite/          # query DB
│ │ ├── storage/         # AsyncStorage
│ │ └── export/          # xuất file (CSV/JSON)
│ │
│ ├── utils/             # hàm tiện ích
│ │ ├── format.js
│ │ ├── validate.js
│ │ ├── constants.js
│ │ ├── alertHelper.js
│ │ └── storageKeys.js
│ │
│ ├── hooks/             # custom hooks
│ │ ├── useTransactions.js
│ │ ├── useBudgetAlert.js
│ │ └── useTheme.js
│ │
│ └── styles/            # style toàn cục
│     ├── colors.js
│     ├── spacing.js
│     ├── typography.js
│     └── globalStyles.js
│
├── tests/               # unit test
│ ├── components/
│ ├── utils/
│ └── setup.js
│
└── docs/                # tài liệu
  ├── README.md
  ├── database_schema.md
  └── user_manual.md
```

---

### 📌 Giải thích ngắn gọn

* `screens/`: Mỗi file là 1 màn hình chính
* `components/`: Thành phần UI tái sử dụng
* `context/`: Quản lý state toàn cục
* `services/`: Xử lý database & storage
* `utils/`: Hàm xử lý logic nhỏ
* `hooks/`: Tái sử dụng logic có state
* `styles/`: Style dùng chung toàn app

---

### Giải thích các thư mục quan trọng:

| Thư mục | Vai trò | Ghi chú |
|---------|---------|---------|
| `screens/` | Chứa từng màn hình chính | Mỗi file tương ứng 1 màn hình, dài < 300 dòng |
| `components/` | Component nhỏ, tái dùng nhiều nơi | Chia theo nhóm chức năng |
| `context/` | Dùng React Context để chia sẻ dữ liệu | Tránh prop drilling |
| `services/` | Tách biệt logic database | Dễ dàng đổi từ SQLite sang Firebase sau này |
| `utils/` | Hàm thuần JS, không liên quan UI | Dễ test unit |
| `hooks/` | Custom Hook để tái sử dụng logic có state | Giảm duplicate code |

---

## 🗄️ PHẦN 4: SƠ ĐỒ CƠ SỞ DỮ LIỆU (SQLITE)

### 4.1. Sơ đồ quan hệ


Hệ thống sử dụng cơ sở dữ liệu **SQLite** với 4 bảng chính:

* `categories` – Lưu danh mục thu/chi
* `transactions` – Lưu các giao dịch
* `budgets` – Lưu ngân sách theo danh mục và tháng
* `settings` – Lưu cấu hình ứng dụng (AsyncStorage)

---

### 🔗 Mối quan hệ giữa các bảng

```text
categories (1) ──────── (N) transactions
categories (1) ──────── (N) budgets
```

---

### 📊 Sơ đồ quan hệ (ERD)

```text
┌──────────────────────┐
│      categories      │
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ icon                 │
│ color                │
│ type (income/expense)│
│ is_default           │
└─────────┬────────────┘
          │
          │ 1
          │
          │ N
┌─────────▼────────────┐
│    transactions      │
├──────────────────────┤
│ id (PK)              │
│ amount               │
│ type                 │
│ category_id (FK)     │
│ note                 │
│ date                 │
│ created_at           │
└──────────────────────┘

          │
          │ 1
          │
          │ N
┌─────────▼────────────┐
│       budgets        │
├──────────────────────┤
│ id (PK)              │
│ category_id (FK)     │
│ amount               │
│ month                │
└──────────────────────┘


┌──────────────────────┐
│       settings       │
├──────────────────────┤
│ id (PK)              │
│ currency             │
│ dark_mode            │
└──────────────────────┘
```

---

### 🧩 Giải thích quan hệ

* Mỗi **category** có thể được sử dụng trong nhiều **transactions**
* Mỗi **category** có thể có nhiều **budgets** theo từng tháng
* Bảng **transactions** tham chiếu `category_id` để xác định loại chi tiêu
* Bảng **budgets** giúp giới hạn chi tiêu theo danh mục
* Bảng **settings** không liên kết trực tiếp (lưu riêng bằng AsyncStorage)

---

### 📌 Ràng buộc toàn vẹn dữ liệu

* `transactions.category_id` → khóa ngoại tham chiếu `categories.id`
* `budgets.category_id` → khóa ngoại tham chiếu `categories.id`
* `budgets` có ràng buộc:

```sql
UNIQUE(category_id, month)
```

→ Mỗi danh mục chỉ có **1 ngân sách / tháng**

---

### ⚠️ Quy tắc nghiệp vụ

* Không cho phép xóa **category** nếu đang được sử dụng trong `transactions`
* Khi xóa category:

  * Có thể:

    * Chặn xóa, hoặc
    * Yêu cầu chuyển sang category khác
* Khi thêm transaction:

  * Phải kiểm tra category tồn tại
* Khi tính toán ngân sách:

  * Chỉ áp dụng cho category có `type = 'expense'`

---



### 4.2. Chi tiết các bảng

#### Bảng `transactions`
| Trường | Kiểu | Ràng buộc | Mô tả | Ví dụ |
|--------|------|-----------|-------|-------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID tự tăng | 1 |
| amount | REAL | NOT NULL, > 0 | Số tiền | 50000 |
| type | TEXT | NOT NULL | 'income' hoặc 'expense' | 'expense' |
| category_id | INTEGER | FOREIGN KEY → categories(id) | ID danh mục | 3 |
| note | TEXT | | Ghi chú | "Mua cơm trưa" |
| date | TEXT | NOT NULL | Định dạng YYYY-MM-DD | '2025-03-15' |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo | '2025-03-15 10:30:00' |

**Index:** `idx_transactions_date` trên cột `date` để tăng tốc truy vấn theo thời gian.

#### Bảng `categories`
| Trường | Kiểu | Ràng buộc | Mô tả | Ví dụ |
|--------|------|-----------|-------|-------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | | 1 |
| name | TEXT | NOT NULL, UNIQUE | Tên danh mục | 'Ăn uống' |
| icon | TEXT | NOT NULL | Tên icon (MaterialIcons) | 'restaurant' |
| color | TEXT | NOT NULL | Mã màu hex | '#FF6B6B' |
| type | TEXT | NOT NULL | 'income' hoặc 'expense' | 'expense' |
| is_default | INTEGER | DEFAULT 0 | 1 nếu là mặc định, không xóa được | 1 |

**Dữ liệu mặc định (seed):**
```sql
INSERT INTO categories (name, icon, color, type, is_default) VALUES
('Ăn uống', 'restaurant', '#FF6B6B', 'expense', 1),
('Di chuyển', 'directions-car', '#4ECDC4', 'expense', 1),
('Hóa đơn', 'receipt', '#45B7D1', 'expense', 1),
('Mua sắm', 'shopping-cart', '#96CEB4', 'expense', 1),
('Giải trí', 'movie', '#FFEAA7', 'expense', 1),
('Sức khỏe', 'favorite', '#DDA0DD', 'expense', 1),
('Lương', 'attach-money', '#2ECC71', 'income', 1),
('Tiền thưởng', 'card-giftcard', '#F39C12', 'income', 1);

Bảng budgets
Trường	Kiểu	Ràng buộc	Mô tả	Ví dụ
id	INTEGER	PRIMARY KEY AUTOINCREMENT		1
category_id	INTEGER	FOREIGN KEY → categories(id)	ID danh mục (chỉ category type='expense')	1
amount	REAL	NOT NULL	Hạn mức / tháng	3000000
month	TEXT	NOT NULL	Định dạng YYYY-MM	'2025-03'
UNIQUE(category_id, month)			Mỗi danh mục mỗi tháng 1 budget


-- Bảng categories
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    is_default INTEGER DEFAULT 0
);

-- Bảng transactions
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL CHECK(amount > 0),
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category_id INTEGER NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Bảng budgets
CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    month TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, month)
);

-- Index cho transactions
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);

🔄 PHẦN 5: LUỒNG XỬ LÝ CHÍNH
5.1. Luồng thêm giao dịch
[User mở app] 
    ↓
Nhấn nút "+" (FAB trên HomeScreen)
    ↓
Điều hướng đến AddEditTransactionScreen
    ↓
Người dùng nhập:
    - Số tiền (bắt buộc, >0)
    - Chọn danh mục (dropdown hiển thị icon + tên)
    - Ghi chú (tùy chọn)
    - Chọn ngày (DatePicker, mặc định = hôm nay)
    - Chọn loại (thu/chi) → tự động lọc danh mục theo loại
    ↓
Nhấn nút "Lưu"
    ↓
Validate:
    - Kiểm tra số tiền > 0
    - Kiểm tra đã chọn danh mục chưa
    - Nếu không hợp lệ → hiển thị lỗi, không cho lưu
    ↓
[Hợp lệ] → TransactionContext gọi transactionDB.insert()
    ↓
Database trả về ID mới
    ↓
Cập nhật state transactions (thêm vào đầu mảng)
    ↓
[Nếu loại = 'expense'] → Kiểm tra ngân sách:
    - Lấy category_id, tháng hiện tại (YYYY-MM)
    - Tính tổng chi của danh mục đó trong tháng (bao gồm giao dịch mới)
    - Lấy budget amount từ bảng budgets
    - Nếu tồn tại budget:
        + Tính % = (tổng chi / budget) * 100
        + Nếu % >= 80 và % < 100 → hiển thị cảnh báo vàng
        + Nếu % >= 100 → hiển thị cảnh báo đỏ
    ↓
Hiển thị Toast/Alert thông báo "Thêm giao dịch thành công"
    ↓
Quay lại HomeScreen, danh sách & biểu đồ tự động cập nhật

