const { StatusCodes } = require('http-status-codes');
const Task = require('../models/Task');

// app.get('api/v1/tasks?parameter=value')  - get all the tasks (with query string)
// app.post('api/v1/tasks')                 - create a new task
// app.get('api/v1/tasks/:id')              - get single task
// app.patch('api/v1/tasks/:id')            - update task
// app.delete('api/v1/tasks/:id')           - delete task 

const getAllTasks = async (req, res) => {
    // getAllTasks able to `sort` and `filter` according to query string
    // sort: [importance, createdAt]
    // filter: [importance, completed(0/1)]
    // ?sort=importance,createdAt&filter=importance>3,completed=0
    const {sort, filter} = req.query;
    const queryObject = {createdBy: req.user.userId};
    const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    };

    if (filter) {
        filter.split(',').forEach((item) => {
            const regEx = /\b(<|<=|=|>=|>)\b/g;
            let [field, optr, val] = item.replace(regEx, (match) => `~${operatorMap[match]}~`).split("~");
            if (field == "importance") {
                queryObject.importance = { [optr]: Number(val) };
            } else {    // field == "completed"
                queryObject.completed = Boolean(Number(val));
            }
        });
    }

    const result = Task.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result.sort(sortList);
    }

    const tasks = await result;

    res.status(StatusCodes.OK).json({ tasks, nbHits: tasks.length });
};

const getSingleTask = async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID, createdBy: req.user.userId });
    if (!task) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find task with id ${taskID}`});
    }
    res.status(StatusCodes.OK).json({ task });
};

const createTask = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const task = await Task.create(req.body);   // use request body to create task
    res.status(StatusCodes.CREATED).json({ task });             // HTTP 201 Created success status
};

const updateTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID, createdBy: req.user.userId });
    if (!task) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find task with id ${taskID}`});
    }
    res.status(StatusCodes.OK).json({ task });
};

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
}