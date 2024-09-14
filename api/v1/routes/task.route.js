const Task = require("../../../models/task.model")

const express = require("express")
const Route = express.Router();

Route.get("/",async (req,res)=>{
    const tasks = await Task.find({
        deleted: false
    })
    console.log(tasks);
    res.json(tasks)
});

Route.get("/detail/:id",async (req,res)=>{
   try {
    const id = req.params.id;
    const tasks = await Task.findOne({
        _id: id,
        deleted: false
    })
    res.json(tasks)
   } catch (error) {
    res.json("không tìm thấy")
   }
})

module.exports = Route;