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