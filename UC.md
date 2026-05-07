UC TỔNG QUÁT
<img width="375" height="376" alt="image" src="https://github.com/user-attachments/assets/72646816-2ebc-455c-a72b-33623d31ea0f" />


| STT | Use Case Tổng Quát (Module) | Use Case Chi Tiết Thành Phần | Vai trò và Chức năng cốt lõi |
| :--- | :--- | :--- | :--- |
| 1 | **Xác thực danh tính** | **UC01:** Đăng nhập / Đăng ký | Quản lý quyền truy cập và bảo mật danh tính người dùng. |
| 2 | **Quản lý hồ sơ cá nhân** | **UC02:** Quản lý hồ sơ cá nhân | Thay đổi thông tin định danh, bảo mật tài khoản và quản lý phiên làm việc. |
| 3 | **Quản lý giao dịch** | **UC04:** Xem danh sách giao dịch<br>**UC05:** Thêm giao dịch mới<br>**UC06:** Cập nhật / Xóa giao dịch | Thực hiện trọn bộ các thao tác nghiệp vụ (CRUD) trên dữ liệu thu chi thực tế. |
| 4 | **Quản lý ngân sách** | **UC07:** Quản lý ngân sách | Thiết lập kế hoạch tài chính, quản lý hạn mức và tính toán số dư kế chuyển. |
| 5 | **Theo dõi & Phân tích** | **UC03:** Xem tổng quan (Dashboard)<br>**UC08:** Xem báo cáo thống kê | Tổng hợp dữ liệu, trực quan hóa qua biểu đồ và đưa ra các cảnh báo tài chính thông minh. |
| 6 | **Xem thông tin ứng dụng** | **UC09:** Xem hướng dẫn sử dụng<br>**UC10:** Xem chính sách bảo mật | Cung cấp tài liệu hỗ trợ và các quy định pháp lý về an toàn dữ liệu. |

---
*Ghi chú: Việc gộp nhóm các Use Case chi tiết vào các Module tổng quát giúp tài liệu thiết kế hệ thống trở nên mạch lạc, dễ quản lý và giúp lập trình viên nắm bắt luồng nghiệp vụ nhanh chóng.*
UC07: Quản lý ngân sách

<img width="627" height="272" alt="image" src="https://github.com/user-attachments/assets/116ad028-85a5-4606-afda-3af698a8f49c" />

# UC07: Quản lý ngân sách

| Thành phần | Nội dung chi tiết |
| :--- | :--- |
| **Mô tả** | Thiết lập hạn mức chi tiêu và tự động hóa lộ trình tài chính hàng tháng. |
| **Tiền điều kiện** | Người dùng đã đăng nhập; Hệ thống có dữ liệu giao dịch để đối soát. |
| **Luồng chính** | 1. Hệ thống truy xuất dữ liệu: Tính toán tổng chi tiêu thực tế và số ngày còn lại trong tháng.<br>2. **Logic Kết chuyển (Rollover):** Tự động tính toán số dư/nợ từ tháng trước để điều chỉnh hạn mức tháng này.<br>3. **Logic Gợi ý:** Tính toán số tiền định mức được tiêu mỗi ngày (`dailySuggested`) dựa trên ngân sách còn lại.<br>4. Hệ thống cập nhật hạn mức mới vào `TransactionContext` khi người dùng yêu cầu lưu. |
| **Luồng phụ** | **Xác nhận nợ:** Nếu số dư tháng trước âm, hệ thống yêu cầu người dùng xác nhận việc trừ nợ vào hạn mức hiện tại trước khi kích hoạt kết chuyển. |
| **Hậu điều kiện** | Hạn mức mới được áp dụng toàn hệ thống; các cảnh báo vượt ngưỡng tại Dashboard (UC03) và Thêm giao dịch (UC05) được cập nhật đồng bộ. |


UC08 - Xem báo cáo thống kê

<img width="919" height="230" alt="image" src="https://github.com/user-attachments/assets/0e04f025-09d3-4f3a-a122-3e47662da8e7" />

# MÔ TẢ CHI TIẾT USE CASE

## UC08: Xem báo cáo thống kê

| Thành phần | Nội dung chi tiết |
| :--- | :--- |
| **Mô tả** | Hệ thống tự động trích xuất, phân tích và tổng hợp dữ liệu giao dịch để cung cấp bức tranh cơ cấu tài chính theo thời gian. |
| **Actor** | Người dùng |
| **Tiền điều kiện** | Người dùng đã đăng nhập; Có ít nhất một giao dịch được lưu trong hệ thống. |
| **Luồng chính** | 1. Hệ thống tiếp nhận yêu cầu phân tích dữ liệu theo các tham số: Kỳ báo cáo (Tháng/Năm) và Bộ lọc (Tất cả/Thu/Chi).<br>2. **Logic Lọc:** Truy xuất danh sách giao dịch tương ứng với tham số đầu vào.<br>3. **Logic Tính toán:** Tính tổng Thu nhập, tổng Chi tiêu và Số dư thực tế của kỳ đó.<br>4. **Logic Phân tích cơ cấu:** Gom nhóm các giao dịch theo Danh mục (Category), tính tổng giá trị từng nhóm và sắp xếp tỷ trọng.<br>5. Trả về tập dữ liệu (Dataset) để hiển thị lên biểu đồ và danh sách chi tiết. |
| **Luồng phụ (Cảnh báo)** | **Logic Đánh giá rủi ro:** Trong quá trình tính toán (Bước 3), nếu hệ thống phát hiện $Số\_dư < 0$ hoặc $Số\_dư < 10\%$ $Tổng\_thu\_nhập$, hệ thống sẽ kích hoạt trạng thái Cảnh báo ("Đang chi vượt mức" hoặc "Ngân sách sắp hết"). |
| **Hậu điều kiện** | Dữ liệu báo cáo chỉ mang tính chất Read-only (Đọc). Hệ thống không làm thay đổi hay xóa bỏ bất kỳ bản ghi gốc nào trong Database. |

UC9 - Hướng dẫn sử dụng và chính sách bảo mật

<img width="752" height="133" alt="image" src="https://github.com/user-attachments/assets/d86bcb53-38cc-45cc-b400-f6c9780f2255" />


# MÔ TẢ CHI TIẾT USE CASE (UC09 & UC10)

## UC09: Xem hướng dẫn sử dụng

| Thành phần | Nội dung chi tiết |
| :--- | :--- |
| **Mô tả** | Cung cấp tài liệu hỗ trợ giúp người dùng làm quen và biết cách thao tác các chức năng trên ứng dụng SpendWise. |
| **Actor** | Người dùng (Đã đăng nhập) hoặc Khách (Chưa đăng nhập). |
| **Tiền điều kiện** | Ứng dụng hoạt động bình thường, không bắt buộc phải đăng nhập. |
| **Luồng chính** | 1. Hệ thống tiếp nhận yêu cầu xem hướng dẫn.<br>2. Hệ thống truy xuất các file tài liệu, văn bản hoặc hình ảnh minh họa từ bộ nhớ tạm (Local) hoặc máy chủ (Server).<br>3. Trả về và hiển thị nội dung lên màn hình người dùng. |
| **Luồng lỗi** | Nếu mất kết nối mạng (trong trường hợp tài liệu lưu trên Server), hệ thống hiển thị thông báo: "Không thể tải nội dung lúc này. Vui lòng kiểm tra lại kết nối". |
| **Hậu điều kiện** | Chức năng Read-only (Chỉ đọc). Tuyệt đối không làm thay đổi trạng thái, cấu trúc hay dữ liệu cốt lõi của hệ thống. |

---

## UC10: Xem chính sách bảo mật

| Thành phần | Nội dung chi tiết |
| :--- | :--- |
| **Mô tả** | Hiển thị các văn bản pháp lý, quy định về quyền riêng tư và cam kết bảo mật dữ liệu của ứng dụng đối với người dùng. |
| **Actor** | Người dùng (Đã đăng nhập) hoặc Khách (Chưa đăng nhập). |
| **Tiền điều kiện** | Không có tiền điều kiện. |
| **Luồng chính** | 1. Hệ thống tiếp nhận lệnh mở Chính sách bảo mật.<br>2. Hệ thống trích xuất nội dung văn bản điều khoản (Terms & Conditions) đã được định nghĩa sẵn.<br>3. Hiển thị toàn bộ văn bản lên màn hình. |
| **Luồng lỗi** | Tương tự UC09, báo lỗi hệ thống/mạng nếu không thể tải file văn bản. |
| **Hậu điều kiện** | Hệ thống giữ nguyên trạng thái hiện tại. Không có dữ liệu nào bị sửa đổi hay xóa bỏ. |
