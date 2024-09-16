module.exports.loginPost = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(!email){
        res.json({
            code : 200,
            message: "Vui lòng nhập email"
        })
        return;
    }
    if(!password){
        res.json({
            code : 200,
            message: "Vui lòng nhập password"
        })
        return;
    }
    next();
}