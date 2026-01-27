import TemporaryDrawer from "@/components/navbar/TemporaryDrawer"
import "../../components/loginComponents/loginComponent.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sleep from "../../components/misc/sleep.jsx";


function Dashboard() {
  const navigate = useNavigate();  
  
  const handleLogout = async() =>{
      await axios.post("http://localhost:4000/auth/logout")
      await sleep(1000);
      navigate("/home")
  }

  const [authenticated, setAuthenticated] = useState(null)
  useEffect(()=>{
  

    axios.get("http://localhost:4000/auth/auth",{credentials:"include"})
    .then(res=>{
      console.log("res", res.data);
      setAuthenticated(res.data.authenticated);
    })
    .catch((err)=>{
      console.log("err:", err);
      setAuthenticated(false);
    });
  
  });

  console.log(authenticated)
  return (
    <div className="Home">
      <TemporaryDrawer></TemporaryDrawer>
    </div>
  );
}
export default Dashboard;