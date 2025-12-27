const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async(req, res) => {
    try{
        //Check email
        const {fullName, email, passWord} = req.body;
        const emailExists = await User.findOne({where: {email}});
        if(emailExists){
            return res.status(400).json({message: "Email da ton tai!"});

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
            verificationToken: verifyToken
        });
        res.status(201).json({message: "Dang ki thanh cong"});


    }
    catch(error){
        res.status(500).json({error: error.message});

    }
};
exports.login = async(req, res) => {
    try{
        const {email, passWord} = req.body;

        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(404).json({message: "Email hoac password khong dung"});
        }

        const isPasswordValid = await bcrypt.compare(passWord, user.passWord);
        if(!isPasswordValid){
            return res.status(400).json({message: "Email hoac password khong dung"})
        }

        //Tao JWT
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn: '30m'})
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                photo: user.photo
            }
        });
    }catch(error){
        res.status(500).json({error: "Error"})
    }
};