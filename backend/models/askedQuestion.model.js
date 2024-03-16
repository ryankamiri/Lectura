const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// question, user, intructorCode

const askedQuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    intructorCode: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
});

const AskedQuestion = mongoose.model('AskedQuestion', askedQuestionSchema);

module.exports = AskedQuestion;