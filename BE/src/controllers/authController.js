const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const sendMail = require('../utils/sendMail');

exports.register = async (req, res) => {
    try {
        //Check email
        const { fullName, email, passWord } = req.body;
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: "Email da ton tai!" });

        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passWord, salt);

        //verificationToken
        const verifyToken = crypto.randomBytes(32).toString('hex');

        //Luu tt user
        const newUser = await User.create({
            fullName,
            email,
            passWord: hashedPassword,
            verificationToken: verifyToken,
            isVerified: false
        });

        //sendmail
        const verifyUrl = `http://localhost:5173/verify-email?token=${verifyToken}`;
        const emailSubject = 'Xác thực tài khoản Task Manager';
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;"> 
            <h1 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
                Chào ${fullName},
            </h1>
        
            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Task Manager</strong>. <br>
                Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email của bạn:
            </p>
        
            <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Xác thực ngay
            </a>
            </div>
        `;
        const isSent = await sendMail(email, emailSubject, emailContent);

        if (isSent) {
            res.status(201).json({ msg: 'Đăng ký thành công! Hãy kiểm tra email.' });
        } else {
            res.status(201).json({ msg: 'Lỗi gửi email' });
        }

    }
    catch (error) {
        res.status(500).json({ error: error.message });

    }
};

exports.verifyEmail = async(req, res)=>{
    try{
        const { token } = req.params;
        //check user
        const user = await User.findOne({ where: { verificationToken: token } });  
        if (!user) {
            return res.status(400).json({ msg: 'Link không hợp lệ hoặc đã kích hoạt rồi!' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ msg: "Kích hoạt thành công!" });

    }catch(err){
        res.status(500).json({ error: err.message});
    }
}


exports.login = async (req, res) => {
    try {
        const { email, passWord } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email hoac password khong dung" });
        }

        if(!user.isVerified) {
            return res.status(401).json({ message: "Vui lòng vào email xác thực tài khoản trước khi đăng nhập!" });
        }

        const isPasswordValid = await bcrypt.compare(passWord, user.passWord);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email hoac password khong dung" })
        }

        //Tao JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' })
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                photo: user.photo
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error" })
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        //check email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: 'Email không tồn tại trong hệ thoongs vui longf ddawng kis' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        //thoi han 15p
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        //link
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
            <h2 style="color: #dc2626; font-weight: bold; margin-bottom: 16px;">Yêu cầu đặt lại mật khẩu</h2>
            <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
                Vui lòng click vào đường link bên dưới để đặt mật khẩu mới:
            </p>

            <a href="${resetUrl}"style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Đặt lại mật khẩu
            </a>

            <p style="margin-top: 24px; color: #4b5563;">
                Link này sẽ hết hạn sau <strong>15 phút</strong>.
            </p>
            </div>
        `;
        const isSent = await sendMail(user.email, 'Yêu cầu đặt lại mật khẩu', message)
        if (isSent) {
            res.status(200).json({ msg: 'Email đã được gửi. Vui lòng kiểm tra hộp thư!' });
        } else {
            user.resetPasswordToken = null;
            user.resetPasswordExpire = null;
            await user.save();
            return res.status(500).json({ msg: 'Lỗi không gửi được email. Vui lòng thử lại.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Lỗi server', error: err.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if(!token || !newPassword) {
            return res.status(400).json({ msg: "Thiếu token hoặc mật khẩu mới" });
        }
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpire: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Mã không hợp lệ hoặc đã hết hạn!' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.passWord = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({ msg: 'Đổi mật khẩu thành công!' });
    }catch(err){
        console.error("Reset Password Error:", err);
        res.status(500).json({ msg: 'Lỗi server', error: err.message });
    }
    
}
