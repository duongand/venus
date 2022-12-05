import Description from './Description';

function Login() {
  return (
    <div className="login-page">
      <h1 className="login-page--title">venus</h1>
      <Description />
      <button className="login-page--login-button">
        <a className="login-page--login-text" href="http://localhost:8888/login">Login with Spotify</a>
      </button>
    </div>
  );
};

export default Login;