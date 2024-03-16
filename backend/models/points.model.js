const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// points, user, intructorCode

const pointsSchema = new Schema({
    points: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    intructorCode: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Points = mongoose.model('Points', pointsSchema);

module.exports = Points;