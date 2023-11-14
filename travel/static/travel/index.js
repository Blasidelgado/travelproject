import { registerPage } from './auth/register.js';


document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('root');

    root.appendChild(registerPage());
});
