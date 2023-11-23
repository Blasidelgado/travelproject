import getCSRFCookie from "../util/csrfHandler.js";

export default function registerPage() {
    const formContainer = document.createElement('div');
    const registrationForm = document.createElement('form');

    registrationForm.innerHTML = `
        <h1>Register</h1>
        <div class="mb-3 input-container">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" name="username">
        </div>
        <div class="mb-3 input-container">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" name="password1">
        </div>
        <div class="mb-3 input-container">
            <label for="confirm-password" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="confirm-password" name="password2">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        <div id="validationLoginForm" aria-describedby="validationServerUsernameFeedback" class="invalid-feedback">
            Incorrect credentials.
        </div>        
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
