const { resetPassword } = require("../controller/user.controller")
const User = require("../models/user.model.js")
module.exports.requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1]
        const user = await User.findOne({
            token: token,
            deleted: false,
        }).select("-password")
        if(!user){
            res.json({
                code: 400,
                message: "token không hợp lệ!"
            })
            return;
        }
        req.user = user;
        next()
    }else{
        res.json({
            code: 400,
            message: "vui lòng gửi kèm token"
        })
    }
}