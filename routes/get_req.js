const express = require('express'),
    router = express.Router()
const UserModel = require("../models/user");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");
const path = require("path");
const cookieParser = require("cookie-parser");
const unirest = require('unirest');
const acceptEmailModel = require("../models/accept_email");
const PostModel = require("../models/post");
require('dotenv').config();

/*Функций для дела*/
function checkCache(req, res) {
    const id = req.cookies._id;

    if(!id){
        res.render('./pages/log-reg.ejs');
    }
}
function getAccessName(item) {
    switch (item) {
        case 0:
            return 'Пользователь';
        case 1:
            return 'Ведущий Мероприятий';
        case 2:
            return 'Руководство Мероприятий';
        case 3:
            return 'Модератор DISCORD';
        case 4:
            return 'Руководство Модераций DS';
        case 5:
            return 'Модератор VK';
        case 6:
            return 'Редактор группы';
        case 7:
            return 'Руководство Модераций VK';
        case 8:
            return 'Технический сотрудник';
        case 9:
            return 'Администрация';
        default:
            return 'Неизвестный доступ';
    }
}
function postName(item) {
    switch (item) {
        case 1:
            return 'Анонс Мероприятий';
        case 2:
            return 'Изменение в составе';
        case 3:
            return 'Нововведение';
        default:
            return 'Неизвестная новость';
    }
}
function statusPost(item) {
    switch (item) {
        case 0:
            return 'Ожидание / на рассмотрений';
        case 1:
            return 'Отказано';
        case 2:
            return 'Одобрено';
        default:
            return 'error';
    }
}
async function findUser(id) {
    const user = await UserModel.findOne({ id });
    return user.login;
}

router.use(cookieParser());

router.get('/', (req, res) => {
    res.redirect('/profile');
});

router.get('/log-reg', (req, res) => {
    res.render('./pages/log-reg.ejs');
});

router.get('/news', async (req, res) => {
    const id = req.cookies._id;
    const user_id = await UserModel.findOne({ id });
    checkCache(req, res)
    try {
        const postCount = await PostModel.countDocuments();

        const page = parseInt(req.query.page) || 1; // Текущая страница
        const perPage = 5; // Количество постов на странице

        const totalPosts = await PostModel.countDocuments(); // Общее количество постов
        const totalPages = Math.ceil(totalPosts / perPage); // Общее количество страниц

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const users = await Promise.all(posts.map(post => findUser(post.user_id)));

        res.render('pages/index', { namepage: 'news', posts, user_id, users, postCount, postName, statusPost, totalPages, currentPage: page });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/panel/:namepage', async (req, res) => {
    const id = req.cookies._id;
    const user_id = await UserModel.findOne({ id });

    res.render('pages/index', { namepage: req.params.namepage, user_id: user_id });
});

router.get('/logout', (req, res) => {
    res.clearCookie('_id');
    res.render('./pages/log-reg.ejs');
});

router.get('/:namepage', async (req, res, next) => {
    if (!req.params.namepage) {
        res.redirect('/profile');
        return;
    }

    checkCache(req, res)

    const id = req.cookies._id;
    const user_id = await UserModel.findOne({ id });

    res.render('pages/index', { namepage: req.params.namepage, user_id: user_id, getAccessName});
});

router.get('/auth/accept/:id', async (req, res) => {
    let id = req.params.id;
    const userdata = await acceptEmailModel.findOne({ id });
    const randomID = uuidv4();

    const doc = new UserModel({
        id: randomID,
        login: userdata.login,
        email: userdata.email,
        password: userdata.password
    })
    const usersave = doc.save()

    const user = await UserModel.findOne({ id: randomID });
    console.log(user)
    res.cookie('_id', user.id, { maxAge: 900000 });
    res.redirect('/profile');
})

router.get('/auth/discord', async (req, res) => {
    if (req.query.code) {
        let clientID = process.env.clientID;
        let redirect_uri = process.env.redirect_uri;
        let clientSecret = process.env.clientSecret;
        let requestPayload = {redirect_uri, client_id: clientID, grant_type: "authorization_code", client_secret: clientSecret, code: req.query.code};
        unirest.post("https://discordapp.com/api/oauth2/token").send(requestPayload).headers({"Content-Type": 'application/x-www-form-urlencoded', "User-Agent": 'DiscordBot'})
            .then((data) => {
                unirest.get("https://discordapp.com/api/users/@me").headers({"Authorization": `${data.body.token_type} ${data.body.access_token}`})
                    .then(async (data) => {
                        console.log(data.body)
                        const id = req.cookies._id;
                        try {
                            // Найдите пользователя по ID и обновите его nickname
                            const updatedUser = await UserModel.findOneAndUpdate(
                                { id: id },
                                { ds: data.body.id },
                                { new: true }
                            );

                            res.redirect('/profile');
                        } catch (error) {
                            res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
                        }
                    })
            })
    }
});

module.exports = router