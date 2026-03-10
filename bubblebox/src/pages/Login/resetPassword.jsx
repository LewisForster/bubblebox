import { useState } from "react";
import LoginPage from "../../components/loginComponents/loginComponent";
import "./Login.css";
import { useParams } from "react-router-dom";
import axios from 'axios'

function ResetPassword() {
    const {token} = useParams()
    const [password, setPassword] = useState("")
    console.log("TOKEN 123 123",token)

    const handleSubmit = async () =>{
        try{
            const res = await axios.post("http://localhost:4000/auth/api/resetPassword", {resetPasswordLink: token, password})
            console.log("TOKEN 123", token)
        } catch (err){
            if (err.response){
                console.log(err.response.data.message)
            }
        }
    }






  return (
    <div className="login-page">
      <a href="/home">
        <img
          className="logo"
          src={"/src/assets/bubbleboxlogo.png"}
          alt="BubbleBox Logo"
        />
      </a>
      <h2 className="title">Forgot Password</h2>

      <div className="login-form">
        <LoginPage showNameField={3}></LoginPage>
      </div>
    </div>
  );
}

export default ResetPassword;
