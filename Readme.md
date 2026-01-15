# Task Management System (MERN Stack)

Hệ thống quản lý công việc hiện đại được xây dựng để giúp tối ưu hóa quy trình làm việc. Ứng dụng tích hợp đầy đủ các tính năng từ quản lý task chi tiết, bảo mật đến xuất báo cáo dữ liệu.


## 🛠 Công nghệ sử dụng (Tech Stack)

### **Frontend**
* **React**: 
* **Vite**: 
* **Tailwind CSS**:
* **Lucide React**: 
* **Tailwind Merge & Clsx
* **Axios**: 

### **Backend**
* **Node.js & Express 5**.
* **MySQL & Sequelize 6**.
* **JWT (JSON Web Token)**. 
* **ExcelJS**.
* **Nodemailer**.

---

## ✨ Tính năng nổi bật

1.  **Quản lý Task toàn diện**: Hỗ trợ đầy đủ các thao tác CRUD với thông tin chi tiết: Title, Status, Priority, và dueDate.
2.  * Phân quyền nghiệp vụ: **Người tạo (Creator)** và **Người thực hiện (Assignee)**.
3.  **Hệ thống tương tác & Cộng tác**: 
    * **Task**: Hỗ trợ thêm, sửa xóa task, xem chi tiets task, lọc task
    * **Subtasks**: Chia nhỏ công việc để quản lý tiến độ chi tiết.
    * **Comments**: Thảo luận trực tiếp trên từng task với chức năng Sửa/Xóa.
4.  **Lịch sử thay đổi (Snapshots)**: Sử dụng `snapshotService` để lưu trữ mọi biến động của task, cho phép xem lại lịch sử cập nhật.
5.  **Thông báo & Sự kiện**: Tích hợp `eventHub` để quản lý sự kiện và `notificationSubscriber` để thông báo khi có thay đổi.
6.  **Xuất báo cáo Excel**: Hỗ trợ tải xuống danh sách công việc dưới dạng file `.xlsx` chuyên nghiệp với đầy đủ thông tin người tạo và người thực hiện.

---

## 📂 Cấu trúc dự án

Dự án được tổ chức theo mô hình **Client-Server** rõ ràng:

```text
Task-Management-System/
├── BE/ (Backend)
│   ├── src/
│   │   ├── config/       # Cấu hình Database 
│   │   ├── controllers/  # Xử lý logic nghiệp vụ chính
│   │   ├── middlewares/  # Xác thực JWT
│   │   ├── models/       # Định nghĩa Schema Sequelize (User, Task,...)
│   │   ├── routes/       # Cấu hình các API
│   │   ├── services/     # SnapshotService
│   │   ├── subscribers/  # NotificationSubscriber 
│   │   └── utils/        # EventHub, sendMail 
│   └── server.js         
└── FE/ (Frontend)
    ├── src/
    │   ├── api/          # Cấu hình Axios Client & API calls
    │   ├── components/   # UI Components tái sử dụng (Modal, Table,...)
    │   ├── lib/          # Các hàm tiện ích (utils)
    │   └── pages/        # Dashboard, Login/Register