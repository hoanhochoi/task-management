const express = require("express")
require("dotenv").config();
const database = require("./config/database")
const bodyParser = require('body-parser')
var cors = require('cors')
const cookieParser = require('cookie-parser')
const routesApiVer1 = require("./api/v1/routes/index.route")

database.connect();
const app = express()
const port = process.env.PORT;

//cookie-parser
app.use(cookieParser()); // key bên trong để bảo mật thông tin

// cors
app.use(cors()) // cross-origin resource
// end cors

// parse application/json
app.use(bodyParser.json())
// lưu ý khởi tạo phải trên route
// route ver 1
routesApiVer1(app);
// end route ver 1

app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})