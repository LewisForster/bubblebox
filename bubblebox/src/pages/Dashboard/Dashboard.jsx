import PersistentDrawer from "@/components/dashboardComponents/sidebars/PersistentDrawer";
import "../../components/loginComponents/loginComponent.css";
import { useEffect, useState } from "react";
import axios from "axios";
import TemporaryDrawer from "@/components/dashboardComponents/sidebars/TemporaryDrawer";
import BoxCanvas from "@/components/dashboardComponents/tasks/boxCanvas.jsx";
import TaskComponent from "@/components/dashboardComponents/tasks/taskComponent.jsx";



function Dashboard() {
  const [authenticated, setAuthenticated] = useState(null)
  const [activeListId, setActiveListID] = useState(null)
  const [listNames, setListNames] = useState(([]))
  const [isOpen, setOpen] = useState(false);
  const [taskList, setTaskList] = useState([]);
  
  const [loaded, setLoaded] = useState(false);


  console.log("hi", isOpen);
  console.log("hi2",activeListId)

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
  
  },[]);   // only need auth check on page load - using empty dependency array[]) //https://devtrium.com/posts/dependency-arrays

  useEffect(()=>{
    axios.get("http://localhost:4000/auth/boxnames")
    .then(res=>{
      setListNames(res.data)
      console.log("hello list id", res.data[0].list_id)
      setActiveListID(res.data[0].list_id)
    })
  },[])


   useEffect(()=>{
    async function fetchTaskInfo() {
    if (activeListId){
     const res = await axios.get("http://localhost:4000/tasks/taskInfo", {params: {list_id: activeListId}})

      setTaskList(res.data)
      console.log("tasks:", res.data)
    }
  }
  fetchTaskInfo();
  }, [activeListId])



  return (
    <div className="Home">
      <PersistentDrawer onActiveList={setActiveListID} isOpen={isOpen} onOpenChange={setOpen} listNames={listNames}/>
      <TemporaryDrawer isOpen={isOpen} onOpenChange={setOpen} listNames={listNames}/> {/*used to open temporary drawer (right sidebar) from persistent drawer (left sidebar)*/}
    <BoxCanvas taskList={taskList}/> {/*https://stackoverflow.com/a/72395897/*/}
    </div> //https://stackoverflow.com/a/60454055
  );
}
export default Dashboard;