const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cấu hình dotenv
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Cho phép React gọi API
app.use(express.json()); // Đọc dữ liệu JSON gửi lên

// Route test
app.get('/', (req, res) => {
    res.send('<h1>Chúc mừng! Bạn đã cài Node.js + Express thành công! 🚀</h1>');
});

// Chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});