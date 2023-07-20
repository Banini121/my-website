const { body } = require('express-validator');

module.exports = [
    body('email', 'Неверный формат логина').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5})
];