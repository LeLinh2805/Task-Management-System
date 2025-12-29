const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
}
})
transporter.verify((err, suc) =>{
    if(err){
        console.log("Loi ket noi Email", err)
    }else{
        console.log("Server da sang sang de gui mail");
    }
})

const sendMail = async(to, subject, htmlContent) =>{
    try{
        await transporter.sendMail({
            from: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log("Mail send to: "+ to);
        return true;
    }catch(err){
        console.log("Error sending mail: ", error);
        return false;
    }

};

module.exports = sendMail;