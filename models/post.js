const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    type: {
        type: Number,
    },
    user_id: {
        type: String,
    },
    post_name: {
        type: String,
    },
    post_mp: {
        type: String,
    },
    post_content: {
        type: String,
        default: 0,
    },
    post_data: {
        type: String,
    },
    status: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;