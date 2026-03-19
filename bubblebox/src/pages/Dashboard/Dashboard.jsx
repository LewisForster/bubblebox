import PersistentDrawer from "@/components/dashboardComponents/sidebars/PersistentDrawer";
import "../../components/loginComponents/loginComponent.css";
import { useEffect, useState } from "react";
import axios from "axios";
import TemporaryDrawer from "@/components/dashboardComponents/sidebars/TemporaryDrawer";
import BoxCanvas from "@/components/dashboardComponents/tasks/boxCanvas.jsx";
import TaskComponent from "@/components/dashboardComponents/tasks/taskComponent.jsx";



function Dashboard() {
  const [authenticated, setAuthenticated] = useState(null)
  const [activeListID, setActiveListID] = useState(null)
  const [listNames, setListNames] = useState(([]))
  const [isOpen, setOpen] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [activeTaskID, setActiveTaskID] = useState(null)
  const [isFull, setIsFull] = useState(false);
  
  const [loaded, setLoaded] = useState(false);
  const [userID, setUserID] = useState(null)


  console.log("hi", isOpen);
  console.log("hi2",activeListID)

  const getTaskID = (taskID) =>{
    setActiveTaskID(taskID);
    setOpen(!isOpen);
  }

  useEffect(()=>{
    
    axios.get("http://localhost:4000/auth/auth",{credentials:"include"})
    .then(res=>{
      console.log("res", res.data);
      setAuthenticated(res.data.authenticated);
      setUserID(res.data.userID)
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
      if (authenticated){
      if (activeListID){
        console.log("active List ID", activeListID)
     const res = await axios.get("http://localhost:4000/tasks/taskInfo", {params: {list_id: activeListID, user_id: userID }})
      setTaskList(res.data)
      console.log("tasks:", res.data)
    }
  }
  }
  fetchTaskInfo();
  }, [activeListID])



  return (
    <div className="Home">
      <PersistentDrawer onActiveList={setActiveListID} onChangeTask={setActiveTaskID} isOpen={isOpen} onOpenChange={setOpen} listNames={listNames}/>
      {userID != null && <TemporaryDrawer isOpen={isOpen} onOpenChange={setOpen} listNames={listNames} userID={userID} activeListID={activeListID} activeTaskID={activeTaskID} isFull={isFull}/> }{/*used to open temporary drawer (right sidebar) from persistent drawer (left sidebar)*/}
    {taskList.length > 0 && <BoxCanvas taskList={taskList} isOpen={isOpen} onOpenChange={setOpen} onTaskSelect={getTaskID} setIsFull={setIsFull} />} {/*https://stackoverflow.com/a/72395897/*/} {/*ensuring task list has data in it, before sent to BoxCanvas*/}
    </div> //https://stackoverflow.com/a/60454055
  );


}
export default Dashboard;