const express = require('express');
const router = express.Router();

const { getAllNotes, getSingleNote, createNote, updateNote, deleteNote } = require('../controllers/notes');
const { getAllTasks, createTask, getSingleTask, updateTask, deleteTask } = require('../controllers/tasks');

// notesRouter: /api/v1/notes
//              /api/v1/notes/:id
// tasksRouter: /api/v1/tasks
//              /api/v1/tasks/:id

router.route('/notes').get(getAllNotes).post(createNote);
router.route('/notes/:id').get(getSingleNote).patch(updateNote).delete(deleteNote);

router.route('/tasks').get(getAllTasks).post(createTask);
router.route('/tasks/:id').get(getSingleTask).patch(updateTask).delete(deleteTask);

module.exports = router;
