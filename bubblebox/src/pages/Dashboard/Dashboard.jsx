import PersistentDrawer from "@/components/dashboardComponents/PersistentDrawer"
import "../../components/loginComponents/loginComponent.css";
import { useEffect, useState } from "react";
import axios from "axios";
import TemporaryDrawer from "@/components/dashboardComponents/TemporaryDrawer"
import BoxCanvas from "@/components/dashboardComponents/boxCanvas"



function Dashboard() {
  const [authenticated, setAuthenticated] = useState(null)

  const [isOpen, setOpen] = useState(false);
  console.log("hi", isOpen);
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
  
  },[]); 
  // only need auth check on page load - using dependency array[])

  console.log(authenticated)
  return (
    <div className="Home">
      <PersistentDrawer isOpen={isOpen} onOpenChange={setOpen} />
      <TemporaryDrawer isOpen={isOpen} onOpenChange={setOpen}/> {/*used to open temporary drawer (right sidebar) from persistent drawer (left sidebar)*/}
    <BoxCanvas></BoxCanvas>
    </div> //https://stackoverflow.com/a/60454055
  );
}
export default Dashboard;