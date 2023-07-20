const express = require('express'),
    router = express.Router()
const UserModel = require("../models/user");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");
const path = require("path");
const acceptEmailModel = require("../models/accept_email");
const PostModel = require("../models/post");
const cookieParser = require("cookie-parser");
require('dotenv').config();
router.use(cookieParser());

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email, password });
        console.log(user)

        if (user) {
            res.cookie('_id', user.id, { maxAge: 900000 });

            res.redirect('/profile');

        } else {
            res.json({
                success: false,
                message: 'Неверное имя пользователя или пароль.',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка сервера.',
        });
        console.log(error)
    }
});

router.post('/auth/register', async (req, res) => {
    const randomID = uuidv4();
    // Создаем транспорт для отправки писем
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_LOGIN,
            pass: process.env.MAIL_PASS
        }
    });

    // Создаем объект письма
    const mailOptions = {
        from: process.env.MAIL_LOGIN,
        to: req.body.email,
        subject: 'Подтверждение регистрация на сайте - http://localhost:3000/',
        html: `
      <h1>Здравствуйте, уважаемый пользователь.</h1>
      <p>Благодарим вас за регистрацию на нашем веб-сайте.</p>
      <p>Чтобы продолжить пользоваться нашим сайтом, необходимо подтвердить вашу электронную почту.</p>
      <p>Пожалуйста, перейдите по ссылке ниже, чтобы подтвердить вашу личность. Ссылка будет действительна в течение 5 минут.</p>
      <p><a href="http://localhost:3000/auth/accept/${randomID}">http://localhost:3000/auth/${randomID}</a></p>
      <p>Если вы не пытались зарегистрироваться на нашем сайте, приносим свои извинения за возможное беспокойство.</p>
      <p>С уважением,<br>Руководство сайта.</p>
    `
    };

    // Отправляем письмо
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log('Ошибка при отправке письма:', error);
            res.render('./pages/log-reg.ejs', {msg: 'Ошибка при отправке письма. Пожалуйста, повторите попытку позже.'});
        } else {
            console.log('Письмо успешно отправлено!', info.response);
            const doc = new acceptEmailModel({
                id: randomID,
                login: req.body.login,
                email: req.body.email,
                password: req.body.password
            })
            const emailsave = await doc.save()

            res.render('./pages/log-reg.ejs', {msg: `<p>Проверьте указанную почту при регистрации и следуйте дальнейшим указаниям. <br>Если нет письма, проверьте папку "Спам".</p>`});

        }
    });
});

router.post('/data/nickname', async (req, res) => {
    const id = req.cookies._id;
    const { nickname } = req.body;

    try {
        // Найдите пользователя по ID и обновите его nickname
        const updatedUser = await UserModel.findOneAndUpdate(
            { id: id },
            { login: nickname },
            { new: true }
        );

        res.redirect('/profile');
    } catch (error) {
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
});

router.post('/data/email', async (req, res) => {
    const id = req.cookies._id;
    const { email } = req.body;

    try {
        // Найдите пользователя по ID и обновите его nickname
        const updatedUser = await UserModel.findOneAndUpdate(
            { id: id },
            { email: email },
            { new: true }
        );

        res.redirect('/profile');
    } catch (error) {
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
});

router.post('/data/password', async (req, res) => {
    const id = req.cookies._id;
    const { password } = req.body;

    try {
        // Найдите пользователя по ID и обновите его nickname
        const updatedUser = await UserModel.findOneAndUpdate(
            { id: id },
            { password: password },
            { new: true }
        );

        res.redirect('/profile');
    } catch (error) {
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
});

router.post('/create/post-anons', async (req, res) => {
    const id = req.cookies._id;
    const randomID = uuidv4();
    const { event_name, event_date_time } = req.body;
    console.log(req.body)
    const user = await UserModel.findOne({ id });

    const doc = new PostModel({
        id: randomID,
        type: 1,
        user_id: user.id,
        post_name: 'Анонс Мероприятия',
        post_mp: event_name,
        post_data: event_date_time,
    })
    const postsave = await doc.save()

    if (doc) {
        // URL веб-хука Discord
        const webhookUrl = 'https://discord.com/api/webhooks/1117540062071099513/DNjpAxq82O2fLKgVjFRrP9mFnzDIHT-88OKfrF3TSOXBGWDEcfv1jsJ77Q2AYBEhMWDT';

        // JSON-тело сообщения с вложенным (embed) сообщением
        const message = {
          embeds: [
            {
              title: '🎉 Анонс мероприятия Мафия', // Заголовок сообщения (жирный текст + большой заголовок)
              description: `
              > ${user.login} назначил мероприятие "${event_name}" на ${event_date_time} (ПО МСК)\n\nПриз:\nУточнять у ведущих`, // Описание сообщения
              color: 16711680 // Красный цвет в шестнадцатеричном формате
            }
          ]
        };

        // Опции для отправки запроса
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        };

        // Отправка запроса на веб-хук Discord
        fetch(webhookUrl, options)
          .then(response => {
            if (response.ok) {
              console.log('Сообщение с Embed отправлено успешно!');
            } else {
              console.error('Ошибка при отправке сообщения с Embed:', response.statusText);
            }
          })
          .catch(error => {
            console.error('Ошибка при отправке сообщения с Embed:', error);
          });
        }

    res.redirect('/profile');
});

router.post('/create/post-news', async (req, res) => {
    const id = req.cookies._id;
    const randomID = uuidv4();
    const { event_name, editor_content } = req.body;

    const user = await UserModel.findOne({ id });

    const doc = new PostModel({
        id: randomID,
        type: 2,
        user_id: user.id,
        post_name: event_name,
        post_content: editor_content,
        post_mp: '',
        post_data: '',
    })
    const postsave = await doc.save()

    res.redirect('/profile');
});

module.exports = router