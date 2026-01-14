const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const subtaskRoutes = require('./src/routes/subTaskRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const setupNotificationSubscriber = require('./src/subscribers/notificationSubscriber')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
sequelize.sync()
    .then(()=>{
        console.log("Ket no DB thanh cong");
    })
    .catch((error) =>{
        console.log("Loi k ket noi dc DB");
        console.error(error);
    })


setupNotificationSubscriber();
// Route
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/exports', express.static(path.join(__dirname, '../public/exports')));

app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});