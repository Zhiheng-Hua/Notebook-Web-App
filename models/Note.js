const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        // maxlength: [30, 'title cannot be more than 30 chars']
    },
    content: {
        type: String
    },
    comments: {
        type: String
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',        // the model that we are referencing
        required: [true, 'please provide a user']
    }
    /* maybe add image in the future */
}, {
    timestamps: true    // tell mongoose to add createdAt and updatedAt to the schema
});


module.exports = mongoose.model('Note', NoteSchema);
