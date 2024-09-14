const express = require("express")
require("dotenv").config();
const database = require("./config/database")

const Task = require("./models/task.model")

database.connect();
const app = express()
const port = process.env.PORT;

app.get("/tasks",async (req,res)=>{
    const tasks = await Task.find({
        deleted: false
    })
    console.log(tasks);
    res.json(tasks)
});

app.get("/tasks/detail/:id",async (req,res)=>{
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
app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})