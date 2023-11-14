export function registerPage() {
    const formContainer = document.createElement('main');
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
            const response = await fetch('api.users', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
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

    // Función para obtener el valor de la cookie CSRF
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
};
