const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// question, answers, correctIndex, intructorCode

const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answers: {
        type: Array,
        required: true,
    },
    correctIndex: {
        type: Number,
        required: true,
        default: 0,
    },
    intructorCode: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;