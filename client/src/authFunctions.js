export function checkLocalStorage() {
    const urlParams = new URLSearchParams(window.localStorage.getItem('params'));

    return (urlParams.get('access_token') !== null);
};

export function setLocalStorage() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('access_token')) {
        window.localStorage.setItem('params', urlParams.toString());
    };
};

export function getAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenParam = urlParams.get('access_token');
    const refreshTokenParam = urlParams.get('refresh_token');

    return {
        storedAccessToken: accessTokenParam,
        storedRefreshToken: refreshTokenParam
    };
};

export function isExpired() {

};