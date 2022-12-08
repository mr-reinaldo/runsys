import Auth from './auth.js';

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


async function mountTableUsers() {
    const tableUsers = document.querySelector('#table-users tbody');
    const { users } = await getAllUsers();

    console.log(users);

    // Mount table
    users.forEach(user => {
        // Create row table
        const row = document.createElement('tr');

        // Create columns
        const columnId = document.createElement('td');
        const columnUsername = document.createElement('td');
        const columnEmail = document.createElement('td');
        const columnOptions = document.createElement('td');

        // Set values
        columnId.textContent = user.id;
        columnUsername.textContent = user.username;
        columnEmail.textContent = user.email;

        // Create button with icon
        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('btn', 'btn-primary', 'btn-sm');
        // Togle modal
        buttonEdit.setAttribute('data-bs-toggle', 'modal');
        buttonEdit.setAttribute('data-bs-target', '#modalUpdateUsers');
        buttonEdit.innerHTML = '<i class="bi bi-pencil-square"></i>';

        // Create button with icon
        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
        // Togle modal
        buttonDelete.setAttribute('data-bs-toggle', 'modal');
        buttonDelete.setAttribute('data-bs-target', '#modalDeleteUsers');
        buttonDelete.innerHTML = '<i class="bi bi-trash"></i>';

        // Append buttons
        columnOptions.appendChild(buttonEdit);
        columnOptions.appendChild(buttonDelete);

        // Append columns
        row.appendChild(columnId);
        row.appendChild(columnUsername);
        row.appendChild(columnEmail);
        row.appendChild(columnOptions);

        // Append row
        tableUsers.appendChild(row);
    });

}

mountTableUsers();