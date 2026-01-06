const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) =>{
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({message: "Vui lòng đăng nhập!"});
    }
    try{
        const verifyed = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifyed;
        next();
    } catch(error){
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
module.exports = verifyToken;