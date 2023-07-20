const mongoose = require('mongoose');

const accept_emailSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    email: {
        type: String,
    },
    login: {
        type: String,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        expires: 300, // Установите время жизни в секундах (5 минут = 300 секунд)
        default: Date.now,
    },
}, {
    timestamps: true,
});

const acceptEmailModel = mongoose.model('accept_email', accept_emailSchema);

module.exports = acceptEmailModel;