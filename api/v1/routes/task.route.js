const express = require("express")
const controller = require("../controller/task.controller")
const Route = express.Router();

Route.get("/",controller.tasks);

Route.get("/detail/:id",controller.detail);

Route.patch("/change-status/:id",controller.changeStatus)

Route.patch("/change-multi",controller.changeMulti);

Route.post("/create",controller.create);

Route.patch("/edit/:id",controller.edit);

Route.delete("/delete/:id",controller.delete);




module.exports = Route;