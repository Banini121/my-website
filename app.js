const express = require('express'),
    morgan = require('morgan'),
    path = require('path')

const mongoose = require('mongoose');
const app = express(),
    port = 3000
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Господин, мне успешно удалось подключиться к MongoDB!');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});

app.engine('ejs', require('ejs-mate'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/css', express.static(__dirname + '/views/css'));
app.use('/img', express.static(__dirname + '/views/img'));
app.use('/js', express.static(__dirname + '/views/js'));
app.use('/', require('./routes/get_req'))
app.use('/', require('./routes/post_req'))
app.use('/user', require('./routes/user'))


app.get('/auth/vk', (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/vk/callback`;
    const scope = 'email'; // запрашиваемые права доступа
    const authUrl = vk.oauth.authorizationCodeGrantAuthUrl({
        redirectUri,
        scope,
    });
    res.redirect(authUrl);
});

app.get('/auth/vk/callback', async (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/vk/callback`;
    try {
        const token = await vk.oauth.authorizationCodeGrant({
            code: req.query.code,
            redirectUri,
        });
        // Здесь можно сохранить токен в базу данных или сессию
        res.send(`Access token: ${token.accessToken}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});

/*Запуск сервера*/
app.listen(port, () => {
    console.log('server started on http://localhost:' + port)
})