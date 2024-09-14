const Task = require("../../../models/task.model")

const express = require("express")
const Route = express.Router();

Route.get("/",async (req,res)=>{
    const find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status
    }
    console.log(req.query);
    // sort
     const sort = {}
     if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey
        const sortValue = req.query.sortValue
        sort[sortKey] = sortValue
     }
    // end sort
    const tasks = await Task.find(find).sort(sort)
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