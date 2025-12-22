import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./loginComponent.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sleep from "../misc/sleep.jsx"
axios.defaults.withCredentials = true;


function LoginPage({ showNameField = false }) {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  }); // values to input to db
  const [error, setError] = useState(); // used for displaying error message

  const navigate = useNavigate(); //navigate import to redirect

  const handleChange = (e) => {
    if (error) {
        setError("");
    }
    const { name, value } = e.target; // stores field name and input 
    setValues({ ...values, [name]: value }); // changes data - create copy of values, select and set field to that value
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents firing of submit

    try{
      let url;
      if (showNameField){
        url = "http://localhost:4000/auth/register"; // if we're showing the name field - i.e: if register page
      }else{
        url ="http://localhost:4000/auth/login"; // login doesn't use name
      }
      
      const res = await axios.post(url,
      values);

      
      switch(res.status){
        case 200:
          setError(res.data);
          await sleep(1500);
          navigate("/home");
          break;


        case 201:
          setError(res.data);
          await sleep(1500);
          navigate("/home");

          break;

         default:
          setError("Unexpected error occured!"); // default as it's proper practice
      }

     } catch (err){
    console.log("Error sending data:",err); // default error



    if(err.response){
        setError(err.response.data); //axios will only read err.response.data for message - passed from authroutes
        console.log(err.response.data) //debug - in case else doesnt catch
      }else{
        setError("An unexpected error occured"); //if an unhandled error occurs or haven't sent response
      }}
  };

  return (
    <Form className="form1" onSubmit={handleSubmit}>
      {error && <div className="error-msg">{error}</div>}
      {showNameField && ( // again, only showing on register page
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label className="formLabel">Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="username"
            value={values.username} // holds current value of name field
            onChange={handleChange}
          ></Form.Control>
        </Form.Group>
      )}

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="formLabel">Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={values.email} // holds current value of email field
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className="formLabel">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={values.password} // holds current value of password field
          onChange={handleChange}
        />
      </Form.Group>
      {!showNameField && ( // used to change link to register
        <Form.Text className="text-muted">
          Don't have an account? <a href="/Register"> Register! </a>
        </Form.Text>
      )}

      {showNameField && ( // used to change link  to login
        <Form.Text className="text-muted">
          Already have an account? <a href="/Login"> Login! </a>
        </Form.Text>
      )}
      <Button variant="primary" type="submit">
        Continue
      </Button>
    </Form>
  );
}
export default LoginPage;
