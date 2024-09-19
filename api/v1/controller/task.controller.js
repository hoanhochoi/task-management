const Task = require("../models/task.model")
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/searchHelper");
// [GET] api/v1/tasks/
module.exports.tasks = async (req, res) => {
    const find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }

    // pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    // end pagination

    // keyword search
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // keyWord Search

    // sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey
        const sortValue = req.query.sortValue
        sort[sortKey] = sortValue
    }
    // end sort
    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.json(tasks)
}

// [GET] api/v1/tasks/detail:id
module.exports.detail = async (req, res) => {
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

//  [PATCH] api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({
            _id: id
        }, {
            status: status
        })
        res.json({
            code: 200,
            message: "cập nhật trạng thái thành công"
        }
        )
    } catch (error) {
        res.json({
            code: 400,
            message: "không tồn tại"
        })
    }
}

// [PATCH] api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { id, key, value } = req.body;
        console.log("oke in ra")
        console.log(id)
        console.log(key)
        console.log(value)
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: id }
                }, {
                    status: value
                })
                res.json({
                    code: 200,
                    message: "cập nhật thành công!"
                })
                break;
            case "delete":
                await Task.updateMany({
                    _id: {$in : req.body.ids}
                },{
                    deleted: true,
                    deletedAt: new Date()
                })
                res.json({
                    code: 200,
                    message: "xóa thành công!"
                })
                break;

            default:
                res.json({
                    code: 400,
                    message: "cập nhật thất bại!"
                })
                break;
        }


    } catch (error) {
        res.json({
            code: 400,
            message: "cập nhật thất bại!"
        })
    }
}

// [POST] api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        const task = new Task(req.body);
        console.log(task)
        const data = await task.save()
        res.json({
            code: 200,
            message: "thêm công việc thành công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "không thành công!"
        })
    }
}

// [PATCH] api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        await Task.updateOne({_id: req.params.id,}, req.body)
        res.json({
            code: 200,
            message: "cập nhật thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "lỗi!"
        })
    }
}

// [DELETE] api/v1/tasks/deleted/:id 
module.exports.delete = async (req,res)=>{
    try {
        await Task.updateOne({_id: req.params.id},{
            deleted: true,
            deletedAt: new Date()
        })
        res.json({
            code: 200,
            message: "xóa thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "lỗi!"
        })
    }
}

