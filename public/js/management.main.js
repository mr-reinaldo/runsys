import Auth from './auth.js';


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

async function getOneAssetById(id) {

    const configRequest = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
        }
    };

    const response = await (await fetch(`/assets/one/${id}`, configRequest)).json();
    return response;
}

async function startXTerminal() {

    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const channel = urlParams.get('channel');

    const terminalContainer =
        document.getElementById('terminal-container');

    const term = new Terminal({ cursorBlink: true });
    term.open(terminalContainer);

    const socket = io.connect();

    socket.on('connect', function () {
        term.write('\r\n*** Connected to backend***\r\n');

        // Browser -> Backend
        term.onData(function (data) {
            socket.emit(channel, data);
        });

        // Backend -> Browser
        socket.on(channel, function (data) {
            term.write(data);

            if (data.includes('SSH CONNECTION CLOSED')) {
                socket.disconnect(true);
            }
        });

        socket.on('disconnect', function () {
            term.write('\r\n*** Disconnected from backend***\r\n');
        });
    });
}

async function startConnection() {
    const buttom = document.querySelector('#startConnection');

    if (buttom) {
        buttom.addEventListener('click', async (e) => {
            e.preventDefault();
            const select = document.querySelector('select.form-select');
            const { value } = select;
            const { asset } = await getOneAssetById(value);

            const configRequest = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`,
                },
                body: JSON.stringify(asset)
            }

            const response = await (await fetch('/terminal', configRequest)).json();

            if (response.message) {
                window.location.href = `/management?channel=${response.channel}`;
            }
        })

    }
}


async function formSelect() {
    const { userId } = Auth.getUserSession();
    const { assets } = await getAllAssetsByUserId(userId);

    const select = document.querySelector('select.form-select');

    // get all inputs
    const [inputUsername, inputPort, inputPassword] = document.querySelectorAll('input.form-control');

    // add disabled attribute
    inputUsername.setAttribute('disabled', true);
    inputPort.setAttribute('disabled', true);
    inputPassword.setAttribute('disabled', true);

    if (select) {
        assets.forEach(asset => {
            const option = document.createElement('option');
            option.value = asset.id;
            option.text = asset.host;
            select.appendChild(option);

            select.addEventListener('change', (e) => {
                const { value } = e.target;
                const assetSelected = assets.find(asset => asset.id == value);

                inputUsername.value = assetSelected.username;
                inputPort.value = assetSelected.port;
                inputPassword.value = assetSelected.password;
            });
        });
    }
};


if (Auth.isAuthenticated()) {
    Auth.userLogged();
    Auth.autoSignout();
    startXTerminal();
    await formSelect();
    await startConnection();
}
