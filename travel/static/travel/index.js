import registerPage from './auth/register.js';
import loginPage from './auth/login.js';
import navBar from './navBar/navBar.js';
import homePage from './pages/home.js';


document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('root');
    const header = document.createElement('header');
    const main = document.createElement('main');
    const footer = document.createElement('footer');

    root.appendChild(header);
    root.appendChild(main);
    root.appendChild(footer);
    header.appendChild(navBar());

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            loadPage(btn.dataset.page);
        })
    })
});

async function loadPage(page = home) {
    const body = document.querySelector("main");
    body.innerHTML = null;
    switch(page) {
        case "home":
            body.appendChild(await homePage());
            break;
        case "login":
            body.appendChild(loginPage());
            break;
        case "register":
            body.appendChild(registerPage());
            break;
        case "logout":
            await logout();
            body.appendChild(await homePage());
    }
}

async function logout() {
    await fetch('api/logout');
}