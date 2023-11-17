export default function navBar(sessionStatus) {
    const navBar = document.createElement('nav');

    navBar.innerHTML = sessionStatus ? 
    `<nav class="navbar navbar-expand-lg bg-body-tertiary p-3">
        <div class="container-fluid flex-nowrap">
            <div class="container">
                <img class="navbar-brand page-btn" data-page="home" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="30" height="24">
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item page-btn" data-page="travel">Travel now</li>
                    <li class="nav-item page-btn" data-page="profile">My profile</li>
                    <li class="nav-item page-btn" data-page="logout">Logout</li>
                </ul>
            </div>
        </div>
    </nav>` 
    :
    `<nav class="navbar navbar-expand-lg bg-body-tertiary p-3">
        <div class="container-fluid flex-nowrap">
            <div class="container">
                <img class="navbar-brand page-btn" data-page="home" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="30" height="24">
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item page-btn" data-page="travel">Travel now</li>
                    <li class="nav-item page-btn" data-page="login">Login</li>
                    <li class="nav-item page-btn" data-page="register">Register</li>
                </ul>
            </div>
        </div>
    </nav>`;

    return navBar;
}
