import Auth from './auth.js';

window.deleteAssets = deleteAssets;
window.updateAssets = updateAssets;

// Get all assets by user id
async function getAllAssetsByUserId(userId) {

    const configRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
        }
    };

    const response = await (await fetch(`/assets/user/${userId}`, configRequest)).json();

    return response;
}

async function getOneAssetById(assetId) {

    const configRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
        }
    };

    const response = await (await fetch(`/assets/one/${assetId}`, configRequest)).json();
    return response;
}


// Mount table assets
async function mountTableAssets() {
    const { userId } = Auth.getUserSession();
    const { assets } = await getAllAssetsByUserId(userId);
    const tableAssets = document.querySelector('#table-assets tbody');

    console.log(assets);

    // Mount table
    assets.forEach(asset => {
        tableAssets.innerHTML += `
            <tr AssetId="${asset.id}">
                <td>${asset.id}</td>
                <td>${asset.host}</td>
                <td>${asset.port}</td>
                <td>${asset.username}</td>
                <td>${asset.password}</td>
                <td>
                    <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modalDeleteAsset" onclick="deleteAssets('${asset.id}')"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#modalUpdateAsset" onclick="updateAssets('${asset.id}')"><i class="bi bi-pencil"></i></button>
                </td>
            </tr>
        `;
    });
}

// Add asset
async function addAssets() {
    const form = document.querySelector('#formAddAssets');
    const tableAssets = document.querySelector('#table-assets tbody');


    const btnAddAsset = document.querySelector('#btnAddAsset');
    const modalAddHost = document.querySelector('#modalAddHost');
    const modalAddPassword = document.querySelector('#modalAddPassword');
    const modalAddConfirmPassword = document.querySelector('#modalAddConfirmPassword');



    // Validate host
    modalAddHost.addEventListener('input', (event) => {
        if (!validateIPaddress(modalAddHost.value)) {
            modalAddHost.setCustomValidity('Invalid IP Address');
        } else {
            modalAddHost.setCustomValidity('');
        }
    });

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
    btnAddAsset.addEventListener('click', async (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            form.classList.add('was-validated');

            return;
        }
        const { modalAddHost, modalAddPort, modalAddUsername, modalAddPassword } = form.elements;

        const { userId } = Auth.getUserSession();

        const data = {
            host: modalAddHost.value,
            port: Number(modalAddPort.value),
            username: modalAddUsername.value,
            password: modalAddPassword.value,
            userId: userId
        };

        const configRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        };

        if (modalAddPassword.value !== modalAddConfirmPassword.value) {
            return;
        }

        const response = await (await fetch('/assets', configRequest)).json();

        if (response.status === 'success') {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.querySelector('#modalAddAssets'));
            modal.hide();

            // Clear form
            form.reset();
            form.classList.remove('was-validated');

            // Reload table
            tableAssets.innerHTML = '';

            mountTableAssets();

        } else {
            console.log(response);
        }

    });
}

// Validar IP Address
function validateIPaddress(ipaddress) {
    if (/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipaddress)) {
        return (true)
    }
    return (false)
}

// Update asset
async function updateAssets(assetId) {
    const form = document.querySelector('#formUpdateAssets');
    const tableAssets = document.querySelector('#table-assets tbody');

    const btnUpdateAsset = document.querySelector('#btnUpdateAsset');
    const modalUpdateHost = document.querySelector('#modalUpdateHost');
    const modalUpdatePassword = document.querySelector('#modalUpdatePassword');
    const modalUpdateConfirmPassword = document.querySelector('#modalUpdateConfirmPassword');

    const { asset } = await getOneAssetById(assetId);
    const { userId } = Auth.getUserSession();

    // Fill form
    const { modalUpdatePort, modalUpdateUsername } = form.elements;

    modalUpdateHost.value = asset.host;
    modalUpdatePort.value = asset.port;
    modalUpdateUsername.value = asset.username;


    // Validate host
    modalUpdateHost.addEventListener('input', (event) => {
        if (!validateIPaddress(modalUpdateHost.value)) {
            modalUpdateHost.setCustomValidity('Invalid IP Address');
        } else {
            modalUpdateHost.setCustomValidity('');
        }
    });

    // Validate password and confirm password
    modalUpdatePassword.addEventListener('input', (event) => {
        if (modalUpdatePassword.value !== modalUpdateConfirmPassword.value) {
            modalUpdateConfirmPassword.setCustomValidity('Passwords do not match');
        } else {
            modalUpdateConfirmPassword.setCustomValidity('');
        }
    });

    modalUpdateConfirmPassword.addEventListener('input', (event) => {
        if (modalUpdatePassword.value !== modalUpdateConfirmPassword.value) {
            modalUpdateConfirmPassword.setCustomValidity('Passwords do not match');
        } else {
            modalUpdateConfirmPassword.setCustomValidity('');
        }
    });

    // Update asset
    btnUpdateAsset.addEventListener('click', async (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            form.classList.add('was-validated');

            return;
        }

        const data = {
            host: modalUpdateHost.value,
            port: Number(modalUpdatePort.value),
            username: modalUpdateUsername.value,
            password: modalUpdatePassword.value,
            userId: userId
        };

        console.log(data);

        const configRequest = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        };

        if (modalUpdatePassword.value !== modalUpdateConfirmPassword.value) {
            return;
        }

        const response = await (await fetch(`/assets/${assetId}`, configRequest)).json();

        if (response.status === 'success') {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.querySelector('#modalUpdateAsset'));
            modal.hide();

            // Clear form
            form.reset();
            form.classList.remove('was-validated');

            // Reload table
            tableAssets.innerHTML = '';

            mountTableAssets();

        }
    });
}

// Delete asset
async function deleteAssets(assetId) {
    const btnDeleteAsset = document.querySelector('#btnDeleteAsset');
    const spanAssetHost = document.querySelector('#modal-delete-host');
    const spanAssetPort = document.querySelector('#modal-delete-port');
    const spanAssetUsername = document.querySelector('#modal-delete-username');
    const spanAssetPassword = document.querySelector('#modal-delete-password');

    const { asset } = await getOneAssetById(assetId);

    spanAssetHost.textContent = asset.host;
    spanAssetPort.textContent = asset.port;
    spanAssetUsername.textContent = asset.username;
    spanAssetPassword.textContent = asset.password;

    btnDeleteAsset.addEventListener('click', async (event) => {
        event.preventDefault();

        const configRequest = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()} `
            }
        };

        const response = await (await fetch(`/assets/${assetId}`, configRequest)).json();

        if (response.status === 'success') {
            // Remove asset from table
            const tr = document.querySelector(`tr[assetId="${assetId}"]`);
            tr.remove();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.querySelector('#modalDeleteAsset'));
            modal.hide();

        }

    });
}

if (Auth.isAuthenticated()) {
    Auth.userLogged();
    Auth.autoSignout();
    Auth.signoutBtn();
    addAssets();
    mountTableAssets();
}



