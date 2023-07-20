const mongoose = require('mongoose');

const userpresSchema = new mongoose.Schema({
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

const userpresModel = mongoose.model('userPres', userpres);

module.exports = userpresModel;