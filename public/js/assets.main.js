import Auth from './auth.js';

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


// Mount table assets
async function mountTableAssets() {
    const { userId } = Auth.getUserSession();
    const { assets } = await getAllAssetsByUserId(userId);
    const tableAssets = document.querySelector('#table-assets tbody');

    console.log(assets);

    // Mount table
    assets.forEach(asset => {
        // Create row table
        const row = document.createElement('tr');

        // Create columns
        const columnId = document.createElement('td');
        const columnHost = document.createElement('td');
        const columnPort = document.createElement('td');
        const columnUsername = document.createElement('td');
        const columnPassword = document.createElement('td');
        const columnOptions = document.createElement('td');

        // Set values
        columnId.textContent = asset.id;
        columnHost.textContent = asset.host;
        columnPort.textContent = asset.port;
        columnUsername.textContent = asset.username;
        columnPassword.textContent = asset.password;

        // Create button with icon
        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('btn', 'btn-primary', 'btn-sm');
        // Togle modal
        buttonEdit.setAttribute('data-bs-toggle', 'modal');
        buttonEdit.setAttribute('data-bs-target', '#modalUpdateAsset');
        buttonEdit.innerHTML = '<i class="bi bi-pencil-square"></i>';

        // Create button with icon
        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
        // Togle modal
        buttonDelete.setAttribute('data-bs-toggle', 'modal');
        buttonDelete.setAttribute('data-bs-target', '#modalDeleteAsset');
        buttonDelete.innerHTML = '<i class="bi bi-trash"></i>';

        // Append buttons
        columnOptions.appendChild(buttonEdit);
        columnOptions.appendChild(buttonDelete);


        // Append columns
        row.appendChild(columnId);
        row.appendChild(columnHost);
        row.appendChild(columnPort);
        row.appendChild(columnUsername);
        row.appendChild(columnPassword);
        row.appendChild(columnOptions);


        // Append row
        tableAssets.appendChild(row);

    });

}

mountTableAssets();




