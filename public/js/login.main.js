import Auth from './auth.js';
const formLogin = document.getElementById('formLogin'); // Formulario de login
const formRegister = document.getElementById('formRegister'); // Formulario de registro
const divAlerts = document.getElementById('divAlerts'); // Div para exibir mensagens de erro

/**
 * Função para exibir mensagens dentro da divAlerts.
 * @param {String} message Mensagem a ser exibida.
 * @param {String} type Tipo de mensagem a ser exibida.
 * @returns {Void}
 */

function alertShow(message, type) {
    divAlerts.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}


/**
 * Função para esconder a divAlerts.
 * @returns {Void}
 */

function alertHide() {
    divAlerts.innerHTML = '';
}


/**
 * Evento para enviar o formulário de registro.
 * @returns {Void}
 */

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verifica se os campos estão preenchidos.
    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.target.classList.add('was-validated');
        return;
    }

    const [username, email, password] = e.target;

    const dataForm = {
        username: username.value,
        email: email.value,
        password: password.value
    };

    const response = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    });

    const data = await response.json();

    if (data.success) {
        alertShow(data.message, 'success');

        // Limpa os campos do formulário.
        e.target.reset();
    } else {
        alertShow(data.message, 'danger');
    }

});


/**
 * Evento para enviar o formulário de login.
 * @returns {Void}
 */

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verifica se os campos estão preenchidos.
    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.target.classList.add('was-validated');
        return;
    }

    const [email, password] = e.target;

    const dataForm = {
        email: email.value,
        password: password.value
    };

    const response = await fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForm)
    });

    const data = await response.json();

    if (data.auth) {
        alertShow(data.message, 'success');
        Auth.signin(data.token);
    } else {
        alertShow(data.message, 'danger');
    }

});