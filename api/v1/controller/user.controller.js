const User = require("../models/user.model")
const md5 = require("md5");
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