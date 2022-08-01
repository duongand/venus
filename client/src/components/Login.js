function Login() {
    return (
        <div className="login-page">
            <h1 className="login-page--title">venus</h1>
            <button className="login-page--login-button">
                <a className="login-page--login-text" href="https://react-spotify-venus.herokuapp.com/login">Login with Spotify</a>
            </button>
        </div>
    );
};

export default Login;