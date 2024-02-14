import checkSessionStatus from "./util/handleSession.js";
import homePage from "./pages/home.js";
import loginPage from "./pages/auth/login.js";
import registerPage from "./pages/auth/register.js";
import navBar from "./components/navBar.js";
import travelPage from "./pages/travel.js";
import profilePage from "./pages/profile.js";
import footerComponent from "./components/footer.js";
import allJourneys from "./pages/journeys.js";
import journeyDetail from "./pages/journeyDetail.js";
import userJourneys from "./pages/userJourneys.js";

export const appState = {
    sessionStatus: false,
};

document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('root');
    const header = document.createElement('header');
    const main = document.createElement('main');
    const footer = document.createElement('footer');

    root.appendChild(header);
    root.appendChild(main);
    root.appendChild(footer);

    changeAppState('home');
});

export async function changeAppState(page, payload, journeysPage=1) {
    if (page === "profile") {
        history.pushState({page: page, payload: payload}, '', `/profile/${payload}`);
        console.log(payload);
        loadPage(page, payload);
    }
    else if (page === "journey") {
        history.pushState({page: page, journey: payload}, '', `/journey/${payload}`);
        loadPage(page, payload, journeysPage);
    }
    else {
        history.pushState({page: page, journeysPage: journeysPage}, '', `/${page}`);
        loadPage(page, payload, journeysPage)
    }
}


export async function loadPage(page, payload, journeysPage=1) {
    const header = document.querySelector("header");
    const body = document.querySelector("main");
    const footer = document.querySelector("footer");
    header.innerHTML = '';
    body.innerHTML = '';
    footer.innerHTML = '';

    await updateSessionStatus();
    header.appendChild(navBar(appState.sessionStatus));
    footer.appendChild(footerComponent());
    
    switch(page) {
        case "home":
            body.appendChild(await homePage(appState.sessionStatus));
            break;
        case "travel":
            body.appendChild(await travelPage(appState.sessionStatus));
            break;
        case "journeys":
            body.appendChild(await allJourneys(journeysPage));
            break;
        case "userJourneys":
            body.appendChild(await userJourneys(journeysPage));
            break;
        case "profile":
            body.appendChild(await profilePage(appState.sessionStatus, payload));
            break;
        case "journey":
            body.appendChild(await journeyDetail(payload));
            break;
        case "login":
            if (!appState.sessionStatus) {
                body.appendChild(await loginPage());
                break;
            } else {
                body.appendChild(await homePage(appState.sessionStatus));
                break;
            }
        case "register":
            body.appendChild(registerPage());
            break;
        case "logout":
            await logout();
            break;
    }
}

window.addEventListener("popstate", event => {
    if (event.state && event.state.page) {
        const page = event.state.page;
        const payload = event.state.payload;
        const journeysPage = event.state.journeysPage;
        console.log(page, payload, journeysPage);
        loadPage(page, payload, journeysPage);
    }
});

async function updateSessionStatus() {
    appState.sessionStatus = await checkSessionStatus();
}

async function logout() {
    const response = await fetch('api/logout');
    const data = await response.json()
    if (data.success) {
        sessionStorage.removeItem('user')
        await loadPage('home');
    } 
}
