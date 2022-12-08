import Auth from './auth.js';
const form = document.querySelector('form');

form.onsubmit = async (event) => {
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        const user = Object.fromEntries(new FormData(form));

        const url = '/signin';
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(user)
        };

        const { auth, token } = await (await fetch(url, config)).json();

        if (auth) {
            Auth.signin(token);
        } else {
            showToast('Error no login');
        }

    }
    form.classList.add('was-validated');
}

function showToast(message) {
    document.querySelector('.toast-header strong').innerText = message;
    const toast = new bootstrap.Toast(document.querySelector('#liveToast'));
    toast.show();
}