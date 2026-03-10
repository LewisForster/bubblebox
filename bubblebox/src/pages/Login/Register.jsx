import LoginPage from "../../components/loginComponents/loginComponent";
import "./Login.css";

function Register() {
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
        <LoginPage showNameField={2}></LoginPage>
      </div>
    </div>
  );
}

export default Register;
