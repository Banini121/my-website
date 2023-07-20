const mongoose = require('mongoose');

const usermoderdsSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    post: {
        type: Number,
    },
    is_warn: {
        type: Number,
        default: 0,
    },
    st_warn: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true,
});

const usermoderdsModel = mongoose.model('userModerDS', usermoderds);

module.exports = usermoderdsModel;