import PersistentDrawer from "@/components/dashboardComponents/sidebars/PersistentDrawer";
import "../../components/loginComponents/loginComponent.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TemporaryDrawer from "@/components/dashboardComponents/sidebars/TemporaryDrawer";
import BoxCanvas from "@/components/dashboardComponents/tasks/boxCanvas.jsx";
import TaskComponent from "@/components/dashboardComponents/tasks/taskComponent.jsx";
import Filter from "@/components/dashboardComponents/utilitiesa/Filter.jsx";



function Dashboard() {
  const [authenticated, setAuthenticated] = useState(null)
  const [activeListID, setActiveListID] = useState(null)
  const [listNames, setListNames] = useState(([]))
  const [isOpen, setOpen] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [activeTaskID, setActiveTaskID] = useState(null)
  const prevListID = useRef(null)
  const [filteredTaskList, setFilteredTaskList] = useState(taskList) 

  const fullLists = useRef([]) // have to use ref - updating fullLists causes re render, bubbles never set.
  const [filters, setFilters] = useState({
    priority:"all"

  })

  
    
  const [loaded, setLoaded] = useState(false);
  const [userID, setUserID] = useState(null)



  console.log("ACTIVELISTID",activeListID)

  const getTaskID = (taskID) =>{ // getting task IDs, checking for importing info into sidebar
    setActiveTaskID(taskID);
    setOpen(!isOpen);
  }

  useEffect(()=>{
    const filteredTaskList = 
  taskList.filter(task => {
    if (filters.priority !== "all" && task.task_priority !== filters.priority) { // if filter is not "all" and task priority does not match filter - exclude
      return false;
    } 
    return true;
  });
  setFilteredTaskList(filteredTaskList);
  }, [filters, taskList]) // filter task list whenever filters or task list changes


  useEffect(()=>{
    
    axios.get("http://localhost:4000/auth/auth",{credentials:"include"}) // authentication check
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

  useEffect(()=>{ // getting listnames
    axios.get("http://localhost:4000/auth/boxnames")
    .then(res=>{
      setListNames(res.data)
      console.log("hello list id", res.data[0].list_id)
      setActiveListID(res.data[0].list_id)
    })
  },[])




   useEffect(()=>{ // taskinfo function
    async function fetchTaskInfo() {
      if (authenticated){
        if (activeListID){
          console.log("active List ID", activeListID)
          const res = await axios.get("http://localhost:4000/tasks/taskInfo", {params: {list_id: activeListID, user_id: userID }})
          setTaskList(res.data)
          console.log("tasks:", res.data)

          if (prevListID.current !== activeListID){ // tracking for list changes - if list changes, set 
            setOpen(false);
            setActiveTaskID(null);
            prevListID.current = activeListID;
          }
    }
  }
  }
  fetchTaskInfo();
  }, [activeListID])



  return (
    <div className="Home">
      <PersistentDrawer onActiveList={setActiveListID} onChangeTask={setActiveTaskID} isOpen={isOpen} onOpenChange={setOpen} listNames={listNames}/>
      {userID != null && <TemporaryDrawer isOpen={isOpen} onOpenChange={setOpen} listNames={listNames} userID={userID} activeListID={activeListID} activeTaskID={activeTaskID} fullLists={fullLists}/> }{/*used to open temporary drawer (right sidebar) from persistent drawer (left sidebar)*/}
      <Filter filters={filters} onChange={setFilters} listNames={listNames}></Filter>
    {taskList.length > 0 && <BoxCanvas taskList={filteredTaskList} activeListID={activeListID} onTaskSelect={getTaskID} fullLists={fullLists} />} {/*https://stackoverflow.com/a/72395897/*/} {/*ensuring task list has data in it, before sent to BoxCanvas*/}
    </div> //https://stackoverflow.com/a/60454055
  );


}
export default Dashboard;