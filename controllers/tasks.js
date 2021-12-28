const { StatusCodes } = require('http-status-codes');
const Task = require('../models/Task');

// app.get('api/v1/tasks')          - get all the tasks
// app.post('api/v1/tasks')         - create a new task
// app.get('api/v1/tasks/:id')      - get single task
// app.patch('api/v1/tasks/:id')    - update task
// app.delete('api/v1/tasks/:id')   - delete task 

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({createdBy: req.user.userId});
        res.status(StatusCodes.OK).json({ tasks, nbHits: tasks.length });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
};

const getSingleTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOne({ _id: taskID, createdBy: req.user.userId });
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find task with id ${taskID}`});
        }
        res.status(StatusCodes.OK).json({ task });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
};

const createTask = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId;
        const task = await Task.create(req.body);   // use request body to create task
        res.status(StatusCodes.CREATED).json({ task });             // HTTP 201 Created success status
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: taskID, createdBy: req.user.userId }, 
            req.body, {
                new: true,              // always return the new item
                runValidators: true     // use model validation to test req body
            }
        );
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find task with id ${taskID}`});
        }
        res.status(StatusCodes.OK).json({ task });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndDelete({ _id: taskID, createdBy: req.user.userId });
        if (!task) {
            return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find task with id ${taskID}`});
        }
        res.status(StatusCodes.OK).json({ task });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
}