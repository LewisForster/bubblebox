import PersistentDrawer from "@/components/dashboardComponents/sidebars/PersistentDrawer";
import "../../components/loginComponents/loginComponent.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import TemporaryDrawer from "@/components/dashboardComponents/sidebars/TemporaryDrawer";
import BoxCanvas from "@/components/dashboardComponents/tasks/boxCanvas.jsx";
import TaskComponent from "@/components/dashboardComponents/tasks/taskComponent.jsx";
import Filter from "@/components/dashboardComponents/utilitiesa/Filter.jsx";
import Button from 'react-bootstrap/Button';



function Dashboard() {

  const [modalShow, setModalShow] = React.useState(false);




  const [authenticated, setAuthenticated] = useState(null)
  const [activeListID, setActiveListID] = useState(null)
  const [listNames, setListNames] = useState(([]))
  const [isOpen, setOpen] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [activeTaskID, setActiveTaskID] = useState(null)
  const prevListID = useRef(null)
  const [filteredTaskList, setFilteredTaskList] = useState(taskList)
  const [tagList, setTagList] = useState([])

  const fullLists = useRef([]) // have to use ref - updating fullLists causes re render, bubbles never set.
  const [filters, setFilters] = useState({
    priority:"all",
    search:"",
    tags:[]

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
    if (filters.tags && filters.tags.length > 0){
      if (!task.tag_id){
        return false
      }
      const taskTags = task.tag_id.split(',')
      console.log("taskTags", taskTags)

      const selectedTags = taskTags.filter(tagID => filters.tags.includes(tagID))
      console.log("selectedTags", selectedTags)
      console.log("filters.tags", filters.tags)

      if (selectedTags.length == 0){
        return false
      }
    }
    if (filters.search !== ""){
      const searchString = filters.search.toLowerCase();
      console.log("searchString", searchString)
      const textMatch = task.task_name.toLowerCase().includes(searchString) || task.task_description.toLowerCase().includes(searchString)
      console.log("textMatch", textMatch)

      if (!textMatch){
        return false
      }
    

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
      if (authenticated && activeListID){
          console.log("active List ID", activeListID)
          const res = await axios.get("http://localhost:4000/tasks/taskInfo", {params: {list_id: activeListID, user_id: userID }})
          const tagRes  = await axios.get('http://localhost:4000/auth/tags', {params: {user_id: userID}})
          setTagList(tagRes.data)
          console.log("TAG LISTTTTT", tagList)
          setTaskList(res.data)
          console.log("tasks:", res.data)
          

          if (prevListID.current !== activeListID){ // tracking for list changes - if list changes, set 
            setOpen(false);
            setActiveTaskID(null);
            prevListID.current = activeListID;
    }
  }
  }
  fetchTaskInfo();
  }, [activeListID, authenticated, userID])



  return (
    <div className="Home">
      <PersistentDrawer onActiveList={setActiveListID} onChangeTask={setActiveTaskID} isOpen={isOpen} onOpenChange={setOpen} listNames={listNames} userID={userID} />
      {userID != null && <TemporaryDrawer isOpen={isOpen} onOpenChange={setOpen} listNames={listNames} userID={userID} activeListID={activeListID} activeTaskID={activeTaskID} fullLists={fullLists}/> }{/*used to open temporary drawer (right sidebar) from persistent drawer (left sidebar)*/}
      <Button style={{position:'relative', zIndex:2000}} variant='outline-primary' onClick={()=>setModalShow(true)}>Filter</Button> {/* Button is unclickable when box is empty / full. Z-index is a bandage fix, but works.*/}
      <Filter filters={filters} onChange={setFilters} listNames={listNames} show={modalShow} tagList={tagList} onHide={()=>setModalShow(false)}></Filter>
    {taskList.length > 0 && <BoxCanvas taskList={filteredTaskList} activeListID={activeListID} onTaskSelect={getTaskID} fullLists={fullLists} />} {/*https://stackoverflow.com/a/72395897/*/} {/*ensuring task list has data in it, before sent to BoxCanvas*/}
    </div> //https://stackoverflow.com/a/60454055
  );


}
export default Dashboard;