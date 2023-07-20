const mongoose = require('mongoose');

const usereditSchema = new mongoose.Schema({
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

const usereditModel = mongoose.model('userEdit', usereditSchema);

module.exports = usereditModel;