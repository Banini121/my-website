const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    login: {
        type: String,
    },
    access: {
        type: Array,
        default: [0]
    },
    vk: {
        type: String,
        default: "Не подключен",
    },
    ds: {
        type: String,
        default: "Не подключен",
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },

}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;