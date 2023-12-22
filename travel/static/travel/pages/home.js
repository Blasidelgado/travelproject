export default async function homePage(sessionStatus) {
    const homeContainer = document.createElement('section');

    homeContainer.innerHTML = `
        <div>
            <img src="https://cdn.blablacar.com/kairos/assets/images/carpool_only_large-1fb250954893109fa160.svg" />
        </div>
        <div>
            <ul class="d-flex">
                <li>
                    <div>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="kirk-icon" role="img" aria-hidden="true" style="height: var(--_1gzv7bh37); width: var(--_1gzv7bh37); fill: var(--_1gzv7bhc);"><g color="var(--_1gzv7bhc)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 11h-3.175L16.567 8.17c-.365-.82-1.23-1.348-2.181-1.348H7.615c-.952 0-1.817.527-2.182 1.348L4.175 11H3a1 1 0 00-1 1v4a1 1 0 001 1h1.55a2.5 2.5 0 004.9 0h5.1a2.5 2.5 0 004.9 0H21a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 3a2.5 2.5 0 00-2.45 2h-5.1a2.5 2.5 0 00-4.9 0H3v-4h18v4h-1.55A2.5 2.5 0 0017 14zm-5.5-3h5.23l-1.077-2.425c-.2-.448-.7-.754-1.267-.754H11.5v3.18zm-1-3.179v3.18H5.27l1.077-2.426c.2-.448.7-.754 1.268-.754H10.5zm-2 8.68a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 18A1.5 1.5 0 1017 15a1.5 1.5 0 000 3z" fill="currentColor"></path></g></svg>                    </div>
                        <p>Encuentra los mejores viajes</p>
                        <p>Lasjdlkshkasjdakdgaksjgakdjkfdfgjadfgjgjkfjfgkajfad</p>
                </li>
                <li>
                    <div>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="kirk-icon" role="img" aria-hidden="true" style="height: var(--_1gzv7bh37); width: var(--_1gzv7bh37); fill: var(--_1gzv7bhc);"><g color="var(--_1gzv7bhc)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 11h-3.175L16.567 8.17c-.365-.82-1.23-1.348-2.181-1.348H7.615c-.952 0-1.817.527-2.182 1.348L4.175 11H3a1 1 0 00-1 1v4a1 1 0 001 1h1.55a2.5 2.5 0 004.9 0h5.1a2.5 2.5 0 004.9 0H21a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 3a2.5 2.5 0 00-2.45 2h-5.1a2.5 2.5 0 00-4.9 0H3v-4h18v4h-1.55A2.5 2.5 0 0017 14zm-5.5-3h5.23l-1.077-2.425c-.2-.448-.7-.754-1.267-.754H11.5v3.18zm-1-3.179v3.18H5.27l1.077-2.426c.2-.448.7-.754 1.268-.754H10.5zm-2 8.68a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 18A1.5 1.5 0 1017 15a1.5 1.5 0 000 3z" fill="currentColor"></path></g></svg>                    </div>
                        <p>Encuentra los mejores viajes</p>
                        <p>Lasjdlkshkasjdakdgaksjgakdjkfdfgjadfgjgjkfjfgkajfad</p>
                </li>
                <li>
                    <div>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="kirk-icon" role="img" aria-hidden="true" style="height: var(--_1gzv7bh37); width: var(--_1gzv7bh37); fill: var(--_1gzv7bhc);"><g color="var(--_1gzv7bhc)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 11h-3.175L16.567 8.17c-.365-.82-1.23-1.348-2.181-1.348H7.615c-.952 0-1.817.527-2.182 1.348L4.175 11H3a1 1 0 00-1 1v4a1 1 0 001 1h1.55a2.5 2.5 0 004.9 0h5.1a2.5 2.5 0 004.9 0H21a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 3a2.5 2.5 0 00-2.45 2h-5.1a2.5 2.5 0 00-4.9 0H3v-4h18v4h-1.55A2.5 2.5 0 0017 14zm-5.5-3h5.23l-1.077-2.425c-.2-.448-.7-.754-1.267-.754H11.5v3.18zm-1-3.179v3.18H5.27l1.077-2.426c.2-.448.7-.754 1.268-.754H10.5zm-2 8.68a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 18A1.5 1.5 0 1017 15a1.5 1.5 0 000 3z" fill="currentColor"></path></g></svg>                    </div>
                        <p>Encuentra los mejores viajes</p>
                        <p>Lasjdlkshkasjdakdgaksjgakdjkfdfgjadfgjgjkfjfgkajfad</p>
                </li>
            </ul>
        </div>
    `

    const callToAction = document.createElement('section');
    if (sessionStatus) {
        callToAction.innerHTML = `
            <div>
                <h3>Travel now click here</h3>
                <p>ASLKDHASKFADHJFDLKNMASGHLSKAKBGLJKGAHLKG</p>
                <button type="button">Travel now</button>
            </div>
        `

    } else {
        
    }
    homeContainer.appendChild(callToAction);

    return homeContainer;
}