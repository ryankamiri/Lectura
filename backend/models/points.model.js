const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// points, user, instructorCode

const pointsSchema = new Schema({
    points: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: String,
        required: true,
    },
    instructorCode: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Points = mongoose.model('Points', pointsSchema);

module.exports = Points;