const monggose = require("mongoose");

module.exports.connect = async ()=>{
    try{
        await 
monggose.connect(process.env.MONGO_URL);
console.log("connect Success!")

    } catch(error){
console.log("connect Error")
    }
}
