import * as React from "react";
import "./sidebarCSS/temporaryDrawer.css";
import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "react-bootstrap/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Chip from '@mui/material/Chip';




import "@/components/navbar/navbar.css";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import colourGen from "../../misc/colourGen.jsx";
import { FormControlLabel, MenuItem } from "@mui/material";
import * as dayjs from 'dayjs'
import { NearMeSharp } from "@mui/icons-material";


export default function AnchorTemporaryDrawer({isOpen, onOpenChange, listNames, activeListID, userID, activeTaskID, fullLists}) {

  const [customReminder, setCustomReminder] = React.useState(false)
  const [listTags, setListTags] = React.useState([])
  const [taskTags, setTaskTags] = React.useState([])

  const [reminderTrue, setReminderTrue] = React.useState(false)
  const [selectedDateTime, setSelectedDateTime] = React.useState(dayjs())
  const prevSize = React.useRef(null) // again using ref to prevent rerender



  const handleCheckChange = (event) => {

    console.log("bef", values.userRemEmail)

    const a = +(!event.target.checked)



    setValues({...values, userRemEmail:a, dueRemEmail:0}) //resetting the reminder flag on clicking checkbox
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus


    console.log("target being set:", a)
  }
  
  const [values,setValues] = React.useState({
    task_id:null,
    list_id:"",
    taskName:"",
    taskDescription:"",
    taskSize:100,
    taskPriority:"0",
    taskColour:colourGen(), // will need to update to not just randomly reset colours
    taskReminder:dayjs(),
    taskDue:dayjs(),
    userRemEmail:0,
    dueRemEmail:0,
    tags:[]
    

  }); // reused logic from the login 



  const fetchData = async (del = null,) =>{
    const res = await axios.get("http://localhost:4000/tasks/taskInfo", {params: {list_id: activeListID, user_id: userID,}})
    const taskRes  = await axios.get('http://localhost:4000/auth/tags', {params: {user_id: userID}})
    const selectedTask = (res.data.find(item=>item.task_id == activeTaskID))

    setListTags(taskRes.data)
    console.log("TASK DATA:", taskRes.data)



  


    if (selectedTask){
      let taskTagArray = [] 

      if (selectedTask.tag_id == null){ // have to check the task has tags.
        taskTagArray = []
      } else{
       taskTagArray = selectedTask.tag_id.split(',') // splitting strring from db response
      }
      setValues({
        task_id:activeTaskID,
        list_id:activeListID,
        taskName:selectedTask.task_name,
        taskDescription:selectedTask.task_description,
        taskSize:selectedTask.task_size,
        taskPriority:selectedTask.task_priority,
        taskColour:selectedTask.task_colour,
        taskReminder:selectedTask.taskReminder,
        taskDue:selectedTask.task_due,
        userRemEmail:selectedTask.user_reminder_emailed,
        dueRemEmail:selectedTask.due_reminder_emailed,
        tags:taskTagArray
      })
      prevSize.current = selectedTask.task_size

    } else{
      setValues({
    task_id:null,
    list_id:activeListID,
    taskName:"",
    taskDescription:"",
    taskSize:100,
    taskPriority:"0",
    taskColour:colourGen(), // will need to update to not just randomly reset colours
    taskReminder:dayjs(),
    taskDue:dayjs(),
    userRemEmail:0,
    dueRemEmail:0,
    tags: []
  })
    prevSize.current=0 // setting to 0, avoiding null errors
    }
  }


// const handleTagChange = (e) =>{
//   const value = e.target.value;

//   setValues({...values, tags:})
// }
  
React.useEffect(()=>{
  fetchData()
},[activeTaskID, activeListID,])

  const handleSizeChange = (e) =>{
    const value = e.target.value;


    if (values.task_id && fullLists.current.includes(values.list_id)){

      console.log("NEW VALUE:", value, "PREV SIZE:", prevSize.current)
      if (prevSize.current < value){  // if list is full, alert
        alert("Box full!");
        return;
      } else {
         setValues({...values, taskSize:value})
      }
    } else{
      setValues({...values, taskSize:value})
    }
    //reused from login, changed for specifically range input
  }
  

  const handleDateChange = (date) =>{
    date = dayjs(date).set('second',0)
    const d1 = dayjs(date).toISOString()
    setSelectedDateTime(d1)
    setValues({...values,taskDue:d1, dueRemEmail:0})
  } // again, same thing, changed for date specifically

  const handleReminderChange = date => {
    const d1 = dayjs(date).toISOString()
    setCustomReminder(date)
    setValues({...values,taskReminder:d1, dueRemEmail:0})
  }
  

  const deleteBubble = async (e) =>{

    const res1 = await axios.get("http://localhost:4000/tasks/taskInfo", {params: {list_id: activeListID, user_id: userID,}})
    const selectedTask = (res1.data.find(item=>item.task_id == activeTaskID))


    const res2 = await axios.post('http://localhost:4000/tasks/deleteTask', {task_id: activeTaskID})
    switch (res2.status){
      case 200:
        console.log("delete success")
        window.location.reload(false)
        break;

      case 500:
        console.log("error deleting task")
        break;
    }

    
    }


  const handleSubmit = async (e) => { //same logic as login - unvalidated currently
  e.preventDefault();

    const url = 'http://localhost:4000/tasks/saveTask'


    if (!values.task_id && fullLists.current.includes(values.list_id)){
      if (prevSize.current < values.taskSize){  // if list is full, alert
        alert("Box full!");
        return;
      }
    }


    const res = await axios.post(url, values);
    switch (res.status){
      case 200:
        console.log('success!');
        console.log(values)
        window.location.reload(true) // reload page to update task info - can change to just update the task list in state, but this is easier for now - will update later;
      break;
      case 500:
        console.log('error!')
        break;
    }
  }


  
  const handleChange = (e) => { //same logic as login - also unvalidated currently
    const { name, value } = e.target;// stores field name and input
    
    console.log('SELECT CHANGE:', name, value);


  
    
    setValues({ ...values, [name]: value, dueRemEmail: 0}); // changes data - create copy of values, select and set field to that value - resetting overdue reminder for edited tasks with dueRemEmail

  };
  

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) { //default in MUI, lets you use the drawer with a keyboard - works so i've left it
      return;
    }

    onOpenChange(false);
  };

  const [selectOptions, setSelectOptions] = React.useState([]);


  const list = (anchor) => (
    <div className="list">
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      >
        <List>
          <Form className="taskForm" onSubmit={handleSubmit}> {/*Again, reusing logic from login form*/}
          <div className="taskName-desc">
              <Form.Group className="formName" controlId="formBasicName">
                <Form.Control
                  type="text"
                  placeholder="Task Name"
                  className="taskName"
                  value={values.taskName}
                  onChange={handleChange}
                  name="taskName"
                />
              </Form.Group>
              <Form.Group className="formDesc" controlId="formBasicDesc">
                <Form.Control
                  as="textarea"
                  placeholder="Task Description"
                  className="taskDesc"
                  value={values.taskDescription}
                  onChange={handleChange}
                  name="taskDescription"
                />
              </Form.Group>
          </div>
          <ListItem>
            <div className="selectArea">
              <label htmlFor="boxSelect">Box:</label>
              <Form.Select aria-label="boxSelect" onChange={handleChange} name="list_id" value={values.list_id}>
                {listNames.map((item) => (
                  <option key={item.list_id} value={item.list_id} >
                    {item.list_name} 
                  </option>
                ))} {/*Here displaying box names - also using it to get the list id for each boxes to put into DB*/}
                {/*https://stackoverflow.com/a/67454511 - alongside previously used code for persistentdrawer*/}
              </Form.Select>
            </div>
          </ListItem>
          <ListItem>
            <div className="colorSelectArea">
              <Form.Control
                type="color"
                id="colorInput"
                title="Choose a colour!"
                value={values.taskColour}
                onChange={handleChange}
                name="taskColour"
              />
              <label htmlFor="colorInput">Colour</label>
            </div>
          </ListItem>
          <ListItem>
            <div className="sizeSliderArea">
              <label htmlFor="sizeSlider">Size:{values.taskSize}</label>
              <Form.Range
                id="sizeSlider"
                type="range"
                min={50}
                max={200}
                step={5}
                value={values.taskSize}
                onChange={handleSizeChange}
                name="taskSize"
              />
            </div>
          </ListItem>
          <ListItem>
            <div className="priorityArea">
              <label htmlFor="prioritySelect">Priority:</label>
              <Select aria-label="prioritySelect" onChange={handleChange} name="taskPriority" value={values.taskPriority}>
                <MenuItem value="0">Priority 0</MenuItem>
                <MenuItem value="1">Priority 1</MenuItem>
                <MenuItem value="2">Priority 2</MenuItem>
                <MenuItem value="3">Priority 3</MenuItem>
                <MenuItem value="4">Priority 4</MenuItem> 
              </Select>
            </div>
          </ListItem>
          <ListItem>
            <label htmlFor="tagSelect">Tags:</label>
            <Select 
            sx={{width:'100%'}}
            displayEmpty
            aria-label="tagSelect" multiple value={values.tags || []} onChange={(e) => setValues({...values, tags:e.target.value})} input={<OutlinedInput placeholder="tags" label="Tags"/>} renderValue={(selected)=>{
              if (selected.length == 0) return <em>Tags</em>;
              return(
              <Box sx={{display:'flex', flexWrap:'wrap'}}>
                {selected.map((id)=>{
                  const tagObj = listTags.find(t => t.tag_id == id);
                  return <Chip key={id} label={tagObj.tag_name}/>
                })}
              </Box>
            )}} // https://mui.com/material-ui/react-select/#placeholder
            > {/*https://mui.com/material-ui/react-select/#chip  */}
              {listTags.map((tag)=>(
                <MenuItem key={tag.tag_id} value={tag.tag_id}>
                {tag.tag_name}
                </MenuItem>
              ))}
            </Select>
          </ListItem> 
          <ListItem>
            <div className="">
              <FormControlLabel control={<Checkbox checked={!(!!values.userRemEmail)} onClick={handleCheckChange}/>}  label="Reminder?"/>
              </div>
          </ListItem>

          {!(!!values.userRemEmail) && (  // https://stackoverflow.com/a/20093686 - userRemEmail is either 1 or 0, won't accept it as int, cast to bool
            <>
            <ListItem>
            <div className="calendarArea">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Reminder:" 
              id="dateTimePicker"
              selected={customReminder}
              onChange={handleReminderChange}
              minDateTime={dayjs()}
              maxDateTime={dayjs(values.taskDue).add(5,'minute')}
              format="DD/MM/YYYY hh:mm A"
              value={dayjs(values.taskReminder)}
              sx={{'& .MuiFormLabel-root': {color:'black'},'& .MuiButtonBase-root': {color:"black"}, '& .MuiPickersOutlinedInput-notchedOutline': {borderColor:"black"}}} //https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles
              />
              </LocalizationProvider>
              </div>
              </ListItem>
            </>

          )}
          <ListItem sx={{justifyContent:'center'}}> {/*getting rid of MUI's stupid padding */}
            <div className="buttonWrapper">
            <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </ListItem>
          </Form>
          <ListItem sx={{justifyContent:'center'}}> {/*getting rid of MUI's stupid padding */}
            <div className="buttonWrapper">
            <Button variant="primary" id="red" type="delete" onClick={deleteBubble}>
                Delete
              </Button>
            </div>
            </ListItem>
        </List>
        <Divider />
      </Box>
    </div>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            elevation={1}
            BackdropProps={{ invisible: true }}
            anchor={anchor}
            open={isOpen}
            locale="en-GB"
            onClose={toggleDrawer()}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))} {/*editing MUI temporary drawer to open on the right - as needed*/}
    </div>
  );
}

