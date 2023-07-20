// Получаем ссылки на кнопки
var loginButton = document.querySelector('#loginButton');
var registerButton = document.querySelector('#registerButton');

// Получаем ссылку на div с классом info
var infoDiv = document.querySelector('.info');

// Функция обработки нажатия кнопки авторизации
function handleLoginButtonClick(event) {
    event.preventDefault(); // Отменяем стандартное поведение формы

    // Создаем элемент формы для авторизации
    var loginForm = document.createElement('form');
    loginForm.className = 'form-container row g-3';
    loginForm.action = "/auth/login";
    loginForm.method = "POST";

    var emailLabel = document.createElement('label');
    emailLabel.textContent = 'Укажите вашу Почту';
    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-control';
    emailInput.id = 'exampleInputEmail1';
    emailInput.name = 'email';
    emailInput.setAttribute('aria-describedby', 'emailHelp');

    var emailHelp = document.createElement('div');
    emailHelp.id = 'emailHelp';
    emailHelp.className = 'form-text';

    var passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Пароль';
    var passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.className = 'form-control';
    passwordInput.id = 'exampleInputPassword1';
    passwordInput.name = 'password';

    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Войти в систему';

    // Добавляем элементы в форму авторизации
    loginForm.appendChild(emailLabel);
    loginForm.appendChild(emailInput);
    loginForm.appendChild(passwordLabel);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(submitButton);

    // Очищаем содержимое div с классом info
    infoDiv.innerHTML = '';

    // Добавляем форму авторизации в div с классом info
    infoDiv.appendChild(loginForm);
}

// Функция обработки нажатия кнопки регистрации
function handleRegisterButtonClick(event) {
    event.preventDefault(); // Отменяем стандартное поведение формы

    // Создаем элемент формы для регистрации
    var registerForm = document.createElement('form');
    registerForm.className = 'form-container row g-3';
    registerForm.action = '/auth/register';
    registerForm.method = 'POST';

    var emailLabel = document.createElement('label');
    emailLabel.textContent = 'Напишите вашу почту';
    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.className = 'form-control';
    emailInput.id = 'inputEmail4';

    var passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Укажите пароль для аккаунта';
    var passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.name = 'password';
    passwordInput.className = 'form-control';
    passwordInput.id = 'inputPassword4';

    var loginLabel = document.createElement('label');
    loginLabel.textContent = 'Укажите никнейм для аккаунта';
    var loginInput = document.createElement('input');
    loginInput.type = 'text';
    loginInput.name = 'login';
    loginInput.className = 'form-control';
    loginInput.id = 'inputAddress';
    loginInput.placeholder = 'Придумайте короткое имя';

    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Создать профиль';

    // Добавляем элементы в форму регистрации
    registerForm.appendChild(emailLabel);
    registerForm.appendChild(emailInput);
    registerForm.appendChild(passwordLabel);
    registerForm.appendChild(passwordInput);
    registerForm.appendChild(loginLabel);
    registerForm.appendChild(loginInput);
    registerForm.appendChild(submitButton);

    // Очищаем содержимое div с классом info
    infoDiv.innerHTML = '';

    // Добавляем форму регистрации в div с классом info
    infoDiv.appendChild(registerForm);
}
if (loginButton) {
    loginButton.addEventListener('click', handleLoginButtonClick);
}

if (registerButton) {
    registerButton.addEventListener('click', handleRegisterButtonClick);
}
/*
// Добавляем обработчики событий нажатия кнопок
loginButton.addEventListener('click', handleLoginButtonClick);
registerButton.addEventListener('click', handleRegisterButtonClick);*/
