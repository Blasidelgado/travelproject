import getCSRFCookie from "../util/csrfHandler.js";

export default function loginPage() {
    const formContainer = document.createElement('div');
    const registrationForm = document.createElement('form');

    registrationForm.innerHTML = `
        <h1>Iniciar sesión</h1>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <label for="password1">Password:</label>
        <input type="password" id="password" name="password" required>
        <button type="submit">Registrar</button>
    `;

    formContainer.appendChild(registrationForm);

    // Submit handler function
    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(registrationForm);

        try {
            const response = await fetch('api/login', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFCookie('csrftoken'),
                },
                body: formData,
            })
            const data = await response.json();

            if (data.success) {
                const {userId, username} = data;
                console.log(`User id: ${userId} username: ${username} logged in succesfully`);
                
            } else {
                // Handle error
                console.error('Error de registro:', data.message);
            }
        } catch(error) {
            // Handle error
            console.error('Error de red:', error);
        }
    });

    return formContainer;
};
