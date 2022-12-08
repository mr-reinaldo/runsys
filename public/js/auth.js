function isAuthenticated() {
    if (!getToken()) {
        window.location.href = '/';
    } else {
        return true;
    }
}

function getToken() {
    return localStorage.getItem('@runsys:token');
}

// get userId in safe mode token
function getUserSession() {
    const token = getToken();
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const { userId, username } = JSON.parse(decodedPayload);

    return { userId, username };
}

function signin(token) {
    localStorage.setItem('@runsys:token', token);
    window.location.href = '/dashboard';
}

function signout() {
    localStorage.removeItem('@runsys:token');

    window.location.href = '/';
}

export default { isAuthenticated, getToken, signin, signout, getUserSession };


