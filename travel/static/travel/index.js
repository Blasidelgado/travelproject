import registerPage from './auth/register.js';
import loginPage from './auth/login.js';
import navBar from './navBar/navBar.js';
import homePage from './pages/home.js';
import checkSessionStatus from './util/handleSession.js';


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


export async function loadPage(page = "home") {
    const body = document.querySelector("main");
    body.innerHTML = '';
    const state = { page: page };
    history.pushState(state, "", `/${page}`);
    const sessionStatus = await checkSessionStatus();

    switch(page) {
        case "home":
            body.appendChild(await homePage(sessionStatus));
            break;
        case "login":
            if (!sessionStatus) {
                body.appendChild(await loginPage());
                break;
            } else {
                body.appendChild(await homePage(sessionStatus));
                break;
            }
        case "register":
            body.appendChild(registerPage());
            break;
        case "logout":
            await logout();
            body.appendChild(await homePage(false));
            break;
    }
}


window.addEventListener("popstate", (event) => {
    const state = event.state;
    if (state) {
        loadPage(state.page);
    }
});

async function logout() {
    await fetch('api/logout');
}
