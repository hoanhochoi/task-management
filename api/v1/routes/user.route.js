const express = require("express")
const Route = express.Router();
const controller = require("../controller/user.controller.js")
const CheckLoginValidate = require("../../../validate/login.js")

Route.post("/register",controller.register);

Route.post("/login",CheckLoginValidate.loginPost,controller.login)

module.exports = Route;