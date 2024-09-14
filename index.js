const express = require("express")
require("dotenv").config();
const database = require("./config/database")
const routesApiVer1 = require("./api/v1/routes/index.route")

database.connect();
const app = express()
const port = process.env.PORT;
// route ver 1
routesApiVer1(app);
// end route ver 1
app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})