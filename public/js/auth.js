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

    // get userId, username and expiresIn
    const { userId, username, exp } = JSON.parse(decodedPayload);

    return { userId, username, exp };
}

function signin(token) {
    localStorage.setItem('@runsys:token', token);
    window.location.href = '/dashboard';
}

// logged out user
function userLogged() {
    const username = getUserSession().username;
    const userLogged = document.querySelector('.nav-link span#logged');

    userLogged.innerHTML = `Olá, <b>${username}</b>`
    return userLogged;
}


// logout user and redirect to login page
function autoSignout() {
    const exp = getUserSession().exp;

    if (exp < Date.now() / 1000) { // check if token is expired
        signout();
    }

    // logout user after token expires
    setTimeout(() => {
        signout();
    }, (exp - Date.now() / 1000) * 1000);

}

function signout() {
    localStorage.removeItem('@runsys:token');

    window.location.href = '/';
}





export default { isAuthenticated, getToken, signin, signout, getUserSession, autoSignout, userLogged };


