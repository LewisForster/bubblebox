import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function GuestRoute() {
  const [authenticated, setAuthenticated] = useState(null); // null = still checking

  useEffect(() => { // synchronising with checking authentication
    axios.get("http://localhost:4000/auth/auth", { credentials: "include" })
      .then(res =>{
        console.log("response:", res.data); //debug
        setAuthenticated(res.data.authenticated); //setting auth status
      })
      .catch((err) =>{
        console.log("Err:", err);
        setAuthenticated(false);
      });
  });

  console.log(authenticated) //debug
  if (authenticated === null) return <div>Checking login...</div>;

  if (!authenticated){
    return <Outlet/>
}else {
    return <Navigate to="/dashboard" />;
  }
}