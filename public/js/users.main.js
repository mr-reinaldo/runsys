import Auth from './auth.js';

window.deleteUsers = deleteUsers;
window.updateUsers = updateUsers;

async function getAllUsers() {
    const configRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
        }
    };

    const response = await (await fetch('/users', configRequest)).json();

    return response;
}

async function getOneUser(userId) {
    const configRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
        }
    };

    const response = await (await fetch(`/users/${userId}`, configRequest)).json();
    return response;
}

async function mountTableUsers() {
    const tableUsers = document.querySelector('#table-users tbody');
    const { users } = await getAllUsers();

    users.forEach((user) => {
        tableUsers.innerHTML += `
            <tr userId="${user.id}">
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modalDeleteUsers" onclick="deleteUsers('${user.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#modalUpdateUsers" onclick="updateUsers('${user.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;
    });

}

async function addUsers() {
    const form = document.querySelector('#formAddUsers');
    const buttomAddUsers = document.querySelector('#buttomAddUsers');
    const modalAddPassword = document.querySelector('#modalAddPassword');
    const modalAddConfirmPassword = document.querySelector('#modalAddConfirmPassword');

    // Validate password and confirm password
    modalAddPassword.addEventListener('input', (event) => {
        if (modalAddPassword.value !== modalAddConfirmPassword.value) {
            modalAddConfirmPassword.setCustomValidity('Passwords do not match');
        } else {
            modalAddConfirmPassword.setCustomValidity('');
        }
    });

    modalAddConfirmPassword.addEventListener('input', (event) => {
        if (modalAddPassword.value !== modalAddConfirmPassword.value) {
            modalAddConfirmPassword.setCustomValidity('Passwords do not match');
        } else {
            modalAddConfirmPassword.setCustomValidity('');
        }
    });

    // Add user
    buttomAddUsers.addEventListener('click', async (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            form.classList.add('was-validated');

            return;
        }
        const { modalAddUsername, modalAddEmail, modalAddPassword } = form.elements;

        const configRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                username: modalAddUsername.value,
                email: modalAddEmail.value,
                password: modalAddPassword.value
            })
        };

        const response = await (await fetch('/users', configRequest)).json();

        form.classList.remove('was-validated');

        // Reset form
        form.reset();

        // Close modal
        const modal = document.querySelector('#modalAddUsers');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        //Refresh table users after add user
        const tableUsers = document.querySelector('#table-users tbody');
        tableUsers.innerHTML = '';
        mountTableUsers();


    });

}

async function deleteUsers(userId) {
    const deleteId = document.querySelector('#modal-delete-id');
    const deleteUsername = document.querySelector('#modal-delete-username');
    const deleteEmail = document.querySelector('#modal-delete-email');

    const modal = document.querySelector('#modalDeleteUsers');
    const modalInstance = bootstrap.Modal.getInstance(modal);


    const tableUsers = document.querySelector('#table-users tbody');

    const buttonDelete = document.querySelector('#buttomDeleteUsers');
    const { user } = await getOneUser(`${userId}`);

    deleteId.textContent = user.id;
    deleteUsername.textContent = user.username;
    deleteEmail.textContent = user.email;


    buttonDelete.addEventListener('click', async (event) => {
        event.preventDefault();
        const configRequest = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            }
        };

        const response = await (await fetch(`/users/${userId}`, configRequest)).json();

        if (response.status === 'success') {
            // Close modal
            modalInstance.hide();

            // Remove tr from table
            const tr = document.querySelector(`tr[userId="${userId}"]`);
            tr.remove();

            // Refresh table users after delete user
            tableUsers.innerHTML = '';
            mountTableUsers();

        }
    });

}

async function updateUsers(userId) {
    const modalFormUpdate = document.querySelector('#modalUpdateUsers form');
    const btnUpdate = document.querySelector('#btnUpdate');

    const username = document.querySelector('#update-username');
    const email = document.querySelector('#update-email');
    const previousPassword = document.querySelector('#update-password-previous');
    const newPassword = document.querySelector('#update-new-password');

    const { user } = await getOneUser(`${userId}`);

    username.value = user.username;
    email.value = user.email;

    btnUpdate.addEventListener('click', async (event) => {
        // Validate inputs
        if (!modalFormUpdate.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            modalFormUpdate.classList.add('was-validated');

            return;
        }

        const data = {
            username: username.value,
            email: email.value,
            previousPassword: previousPassword.value,
            newPassword: newPassword.value
        };

        const configRequest = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)

        };

        const response = await (await fetch(`/users/${userId}`, configRequest)).json();

        if (response.status === 'success') {
            // Close modal
            const modal = document.querySelector('#modalUpdateUsers');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            // Reset form
            modalFormUpdate.reset();

            // Refresh table users after update user
            const tableUsers = document.querySelector('#table-users tbody');
            tableUsers.innerHTML = '';
            mountTableUsers();

        } else {
            // Create invalid feedback for previous password
            const invalidFeedback = document.querySelector('#invalid-feedback-previous-password');
            const validFeedback = document.querySelector('#valid-feedback-previous-password');

            invalidFeedback.textContent = response.message;
            validFeedback.textContent = '';

            previousPassword.classList.add('is-invalid');
            previousPassword.classList.remove('is-valid');
        }

    });
}


if (Auth.isAuthenticated()) {
    Auth.userLogged();
    Auth.autoSignout();
    mountTableUsers();
    addUsers();
}