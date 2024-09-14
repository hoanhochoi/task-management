const express = require("express")
const controller = require("../controller/task.controller")
const Route = express.Router();

Route.get("/",controller.tasks);

Route.get("/detail/:id",controller.detail);



module.exports = Route;