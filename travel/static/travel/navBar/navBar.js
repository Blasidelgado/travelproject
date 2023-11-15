export default function navBar() {
    const headerContainer = document.createElement('header');
    const navBar = document.createElement('nav');

    navBar.innerHTML = `
        <ul>
            <li><button class="nav-btn" data-page="home">Home</button></li>
            <li><button class="nav-btn" data-page="login">Login</button></li>
            <li><button class="nav-btn" data-page="register">Register</button></li>
            <li><button class="nav-btn" data-page="logout">Logout</button></li>
        </ul>
    `;

    headerContainer.appendChild(navBar);

    return headerContainer;
}
