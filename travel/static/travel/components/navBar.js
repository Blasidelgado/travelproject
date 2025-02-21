export default function navBar(sessionStatus) {
    const navBar = document.createElement('nav');
    navBar.classList = 'navbar navbar-expand-lg bg-body-tertiary p-3';

    navBar.innerHTML = sessionStatus ?
    `<div class="container-fluid flex-nowrap">
        <div class="container img-wrapper">
            <img class="navbar-brand page-btn" data-page="/" src="/media/logo.jpg" alt="logo" role="button" width="85" height="70">
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse flex-grow-1 w-75 z-1" id="navbarNav">
            <ul class="navbar-nav d-lg-flex justify-content-evenly w-100">
                <li class="nav-item page-btn" data-page="/travel">Travel now</li>
                <li class="nav-item page-btn" data-page="/journeys">All journeys</li>
                <li class="nav-item page-btn" data-page="/my-journeys">My journeys</li>
                <li class="nav-item page-btn" data-page="/profile">My profile</li>
                <li class="nav-item page-btn" data-page="/logout">Logout</li>
            </ul>
        </div>
    </div>` 
    :
    `<div class="container-fluid flex-nowrap">
        <div class="container w-25">
            <img class="navbar-brand page-btn" data-page="/" src="/media/logo.jpg" alt="logo" role="button" width="85" height="70">        </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </div>
        </button>
        <div class="collapse navbar-collapse w-75 z-1" id="navbarNav">
            <ul class="navbar-nav d-lg-flex justify-content-evenly w-100">
                <li class="nav-item page-btn" data-page="/journeys">All journeys</li>
                <li class="nav-item page-btn" data-page="/login">Login</li>
                <li class="nav-item page-btn" data-page="/register">Register</li>
            </ul>
        </div>
    </div>`;

    return navBar;
}
