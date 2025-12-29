const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes')

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
sequelize.sync({force: true})
    .then(()=>{
        console.log("Ket no DB thanh cong")
    })
    .catch((error) =>{
        console.log("Loi k ket noi dc DB")
    })

// Route
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});