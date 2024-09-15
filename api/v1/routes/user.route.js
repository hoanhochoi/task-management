const express = require("express")
const Route = express.Router();
const controller = require("../controller/user.controller.js")

Route.post("/register",controller.register);

module.exports = Route;