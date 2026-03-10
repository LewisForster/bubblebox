import LoginPage from "../../components/loginComponents/loginComponent";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <a href="/home">
        <img
          className="logo"
          src={"./src/assets/bubbleboxlogo.png"}
          alt="BubbleBox Logo"
        />
      </a>

      <div className="login-form">
        <LoginPage showNameField={1}></LoginPage>
      </div>
    </div>
  );
}

export default Login;
