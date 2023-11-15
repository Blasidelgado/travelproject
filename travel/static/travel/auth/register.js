import getCSRFCookie from "../util/csrfHandler.js";

export default function registerPage() {
    const formContainer = document.createElement('div');
    const registrationForm = document.createElement('form');

    registrationForm.innerHTML = `
        <h1>Registro de Usuario</h1>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <label for="password1">Password:</label>
        <input type="password" id="password1" name="password1" required>
        <label for="password2">Confirm Password:</label>
        <input type="password" id="password2" name="password2" required>
        <button type="submit">Registrar</button>
    `;

    formContainer.appendChild(registrationForm);

    // Manejar el envío del formulario
    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(registrationForm);

        try {
            const response = await fetch('api/users', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFCookie('csrftoken'),
                },
                body: formData,
            })
            const data = await response.json();

            if (data.success) {
                const {userId, username} = data;
                console.log(`User id: ${userId} username: ${username} created succesfully`)
            } else {
                // Manejar errores, puedes mostrar mensajes de error
                console.error('Error de registro:', data.message);
            }
        } catch(error) {
            console.error('Error de red:', error);
        }
    });

    return formContainer;
};