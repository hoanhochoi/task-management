const User = require("../models/user.model")
const md5 = require("md5");
const generateHelper = require("../../../helper/generate");
const sendMailHelper = require("../../../helper/sendMail");
const forgotPassword = require("../models/forgotPassword.model");
// [POST] api/v1/users/register
module.exports.register = async (req,res)=>{
    req.body.password = md5(req.body.password);
    const {fullName,email,password} = req.body;

    const exist = await User.findOne({
        email: email,
        deleted: false
    })
    if(exist){
        res.json({
            code : 400,
            message: "email đã tồn tại!"
        })
    }else{
        const user = new User({
            fullName: fullName,
            email: email,
            password : password
        })
        const token = user.token;
        res.cookie("token",token)
        user.save();
        res.json({
            code: 200,
            message: "thêm user thành công!",
            token : token
        })
    }
    
}

// [POST] api/v1/user/login
module.exports.login = async (req,res)=>{
 try {
    req.body.password = md5(req.body.password);
    const {email,password} = req.body;
    console.log(email)
    console.log(password);
    const user = await User.findOne({
        email: email,
        deleted: false,
    })
    if(!user){
        res.json({
            code: 400,
            message: "email không tồn tại!"
        })
    }
    console.log(user)
    const token = user.token
    res.cookie("token",token)
    if(user.password !== password){
        res.json({
            code: 400,
            message: "mật khẩu không đúng!"
        })
    }
    res.json({
        code: 200,
        message: "đăng nhập thành công!"
    })
 } catch (error) {
    res.clearCookie("token")
    res.json({
        code: 400,
        message: "đăng nhập thất bại"
    })
 }
}

// [POST] api/v1/user/password/forgot 
module.exports.forgotPassword = async (req,res)=>{
    console.log(req.body)
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        res.json({
            code: 400,
            message: "email không tồn tại!"
        })
        return;
    }
    const timeExpire = 5;
    const otp = generateHelper.generateRandomNumber(6);
    const objForgotPassword = {
        email: user.email,
        otp: otp,
        expireAt : Date.now() + timeExpire
    }
    const obj = new forgotPassword(objForgotPassword);
    obj.save();

    // gửi OTP qua email user
    const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b style="color:deeppink">${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

    sendMailHelper.sendMail(email,subject,html)
    res.json({
        code: 200,
        message:"Đã gửi mã OTP qua email"
    })
}

// [POST] api/v1/users/password/otp
module.exports.otpPassword = async (req,res)=>{
    const {email,otp} = req.body;
    const result = await forgotPassword.findOne({
        email: email,
        otp: otp
    })
    if(!result){
        res.json({
            code: 400,
            message: "mã otp không đúng!"
        })
        return ;
    }
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    const token = user.token;
    res.cookie("token",token)
    res.json({
        code: 200,
        message: "xác thực thành công!"
    })
}
