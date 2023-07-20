const mongoose = require('mongoose');

const usermodervkSchema = new mongoose.Schema({
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

const usermodervkModel = mongoose.model('userModerVK', usermodervk);

module.exports = usermodervkModel;