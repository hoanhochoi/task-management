const express = require("express")
const Route = express.Router();
const controller = require("../controller/user.controller.js")
const CheckLoginValidate = require("../../../validate/login.js")
const authMiddleware = require("../middlewares/auth.middleware.js");

Route.post("/register",controller.register);

Route.post("/login",CheckLoginValidate.loginPost,controller.login)

Route.post("/password/forgot",controller.forgotPassword)

Route.post("/password/otp",controller.otpPassword)

Route.post("/password/reset",controller.resetPassword)

Route.get("/detail",authMiddleware.requireAuth,controller.detail);

Route.get("/list",authMiddleware.requireAuth,controller.listUser);
module.exports = Route;