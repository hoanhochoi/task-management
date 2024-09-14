const Task = require("../models/task.model")
const paginationHelper = require("../../../helper/pagination");
// [GET] api/v1/tasks/
module.exports.tasks = async (req,res)=>{
    const find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status
    }

    // pagination
    let initPagination = {
        currentPage : 1,
        limitItems : 2
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    // end pagination

    // sort
     const sort = {}
     if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey
        const sortValue = req.query.sortValue
        sort[sortKey] = sortValue
     }
    // end sort
    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    console.log(tasks);
    res.json(tasks)
}

// [GET] api/v1/tasks/detail:id
module.exports.detail = async (req,res)=>{
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
 }