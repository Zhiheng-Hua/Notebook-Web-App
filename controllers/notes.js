const { StatusCodes } = require('http-status-codes');
const Note = require('../models/Note');

// app.get('api/v1/notes')          - get all the notes
// app.post('api/v1/notes')         - create a new note
// app.get('api/v1/notes/:id')      - get single note
// app.patch('api/v1/notes/:id')    - update note
// app.delete('api/v1/notes/:id')   - delete note 

const getAllNotes = async (req, res) => {
    const notes = await Note.find({createdBy: req.user.userId});
    res.status(StatusCodes.OK).json({ notes, nbHits: notes.length });
}

const getSingleNote = async (req, res) => {
    const { id: noteID } = req.params;
    const note = await Note.findOne({ _id: noteID, createdBy: req.user.userId });
    if (!note) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot note task with id ${noteID}`});
    }
    res.status(StatusCodes.OK).json({ note });
}

const createNote = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const note = await Note.create(req.body);       // use request body to create note
    res.status(StatusCodes.CREATED).json({ note });
}

const updateNote = async (req, res) => {
    const { id: noteID } = req.params;
    const note = await Note.findOneAndUpdate(
        { _id: noteID, createdBy: req.user.userId }, 
        req.body, {
            new: true,              // always return the new item
            runValidators: true     // use model validation to test req body
        }
    );
    if (!note) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find note with id ${noteID}`});
    }
    res.status(StatusCodes.OK).json({ note });
}

const deleteNote = async (req, res) => {
    const { id: noteID } = req.params;
    const note = await Note.findOneAndDelete({ _id: noteID, createdBy: req.user.userId });
    if (!note) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: `Cannot find note with id ${noteID}`});
    }
    res.status(StatusCodes.OK).json({ note });
}

module.exports = {
    getAllNotes,
    getSingleNote,
    createNote,
    updateNote,
    deleteNote
}
