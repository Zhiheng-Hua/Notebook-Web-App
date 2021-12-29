const mongoose = require('mongoose');

/* Template for task */

// 1. models are fancy constructors compiled from Schema definitions
// 2. instance of models are called documents
// 3. when creating domuments using this schema, if data of undefined field is
// provided, they will be ignored

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name field is required"],     // the second elem in arr is a custom message
        trim: true,
        maxlength: [30, "name cannot be more than 30 characters"]
    },
    deadline : {
        type: String,
        default: ""
    },
    importance: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],   // importance at a sacle of 5
        default: 0
    },
    completed: {
        type: Boolean,
        default: false      // default value of the field
    }, 
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',        // the model that we are referencing
        required: [true, 'please provide a user']
    }
}, {
    timestamps: true    // tell mongoose to add createdAt and updatedAt to the schema
});

module.exports = mongoose.model('Task', TaskSchema);    
    // The first argument is the singular name of the collection your model is for. 
    // Mongoose automatically looks for the plural, lowercased version of your model name
    // in this case, `tasks` is the name used in the MongoDB database page




