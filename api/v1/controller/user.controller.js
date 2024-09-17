const User = require("../models/user.model")
const md5 = require("md5");
const generateHelper = require("../../../helper/generate");
const sendMailHelper = require("../../../helper/sendMail");
const forgotPassword = require("../models/forgotPassword.model");
// [POST] api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);
    const { fullName, email, password } = req.body;

    const exist = await User.findOne({
        email: email,
        deleted: false
    })
    if (exist) {
        res.json({
            code: 400,
            message: "email đã tồn tại!"
        })
    } else {
        const user = new User({
            fullName: fullName,
            email: email,
            password: password,
            token: generateHelper.generateRandomString(30)
        })
        const token = user.token;
        res.cookie("token", token)
        user.save();
        res.json({
            code: 200,
            message: "thêm user thành công!",
            token: token
        })
    }

}

// [POST] api/v1/user/login
module.exports.login = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
        const { email, password } = req.body;
        console.log(email)
        console.log(password);
        const user = await User.findOne({
            email: email,
            deleted: false,
        })
        if (!user) {
            res.json({
                code: 400,
                message: "email không tồn tại!"
            })
        }
        console.log(user)
        const token = user.token
        res.cookie("token", token)
        if (user.password !== password) {
            res.json({
                code: 400,
                message: "mật khẩu không đúng!"
            })
            return;
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
module.exports.forgotPassword = async (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
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
        expireAt: Date.now() + timeExpire*60*1000
    }
    const obj = new forgotPassword(objForgotPassword);
    obj.save();

    // gửi OTP qua email user
    const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b style="color:deeppink">${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

    sendMailHelper.sendMail(email, subject, html)
    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email"
    })
}

// [POST] api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const { email, otp } = req.body;
    const result = await forgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!result) {
        res.json({
            code: 400,
            message: "mã otp không đúng!"
        })
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    const token = user.token;
    res.cookie("token", token)
    res.json({
        code: 200,
        message: "xác thực thành công!"
    })
}

// [POST] api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
    // nếu không muốn lấy token ở body thì lấy ở cookie = req.cookies
    const users = await User.find({
        deleted: false
    })
    console.log(users);
    const { token, password } = req.body;
    console.log("token:" + token)
    console.log("password:" + password)
    const user = await User.findOne({
        token: token
    })
    console.log(user);
    console.log("mk md5:" + user.password)
    console.log("mk gui md5:" + md5(password))
    if (md5(password) === user.password) {
        res.json({
            code: 400,
            message: "vui lòng nhập mật khẩu mới khác mật khẩu cũ!"
        })
        return;
    }
    await User.updateOne({
        token: token,
    }, {
        password: md5(password)

    })
    res.json({
        code: 200,
        mesage: "đặt lại mật khẩu thành công"
    })
}


// [GET] api/v1/users/detail
module.exports.detail = async (req,res)=>{
    try {
        const token = req.cookies.token;
    const user = await User.findOne({
        token: token,
        deleted: false
    }).select("-password -deleted")

    console.log(user)
    res.json({
        code: 200,
        message: "lấy thông tin thành công",
        user: user
    })
    } catch (error) {
        res.json({
            code: 400
        })
    }
}