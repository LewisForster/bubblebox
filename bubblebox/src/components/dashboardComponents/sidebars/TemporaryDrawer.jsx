import * as React from "react";
import "./sidebarCSS/temporaryDrawer.css";
import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "react-bootstrap/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import "@/components/navbar/navbar.css";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import colourGen from "../../misc/colourGen.jsx";
import { registerLocale, setDefaultLocale, DatePicker } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { render } from "ejs";

export default function AnchorTemporaryDrawer({ isOpen, onOpenChange, listNames}) {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

    
  const [values,setValues] = React.useState({
    task_id:null,
    list_id:"",
    taskName:"",
    taskDescription:"",
    taskSize:0,
    taskPriority:"0",
    taskColour:colourGen(), // will need to update to not just randomly reset colours
    taskReminder:null,
    taskDue:new Date(),

  }); // reused logic from the login 

  const handleSizeChange = (e) =>{
    const value = e.target.value;
    setSize(value)
    setValues({...values, taskSize:value}) //reused from login, changed for specifically range input
  }
  

  const handleDateChange = (date) =>{
    setSelectedDateTime(date)
    setValues({...values,taskDue:date})
  } // again, same thing, changed for date specifically
  registerLocale("es", es); 


  const [selectedDateTime, setSelectedDateTime] = React.useState(new Date());


  const handleSubmit = async (e) => { //same logic as login - unvalidated currently
    e.preventDefault(); // prevents firing of submit

    const url = 'http://localhost:4000/tasks/saveTask'

    const res = await axios.post(url, values);

    switch (res.status){
      case 200:
        console.log('success!');
        break;
      
      case 500:
        console.log('error!')
        break;
    }

  }


  const handleChange = (e) => { //same logic as login - also unvalidated currently
    const { name, value } = e.target;// stores field name and input
    console.log('SELECT CHANGE:', name, value);
    setValues({ ...values, [name]: value }); // changes data - create copy of values, select and set field to that value
  };

  const [size, setSize] = React.useState(0);

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

  // React.useEffect(() => {
  //   const getSelectOptions = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         "http://localhost:4000/auth/boxnames",
  //         { credentials: "include" },
  //       ); // getting list names to display in box
  //       setSelectOptions(data);
  //       console.log(data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getSelectOptions();
  // }, []);

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
                <option value="placeholder">Select a Box</option>
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
              <label htmlFor="sizeSlider">Size:{size}</label>
              <Form.Range
                id="sizeSlider"
                type="range"
                min={0}
                max={100}
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
              <Form.Select aria-label="prioritySelect" onChange={handleChange} name="taskPriority">
                <option value="0">Priority 0</option>
                <option value="1">Priority 1</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
                <option value="4">Priority 4</option>
              </Form.Select>
            </div>
          </ListItem>
          <ListItem>
            <div className="calendarArea">
            <label htmlFor="dateTimePicker">Due:</label>
            <DatePicker 
              id="dateTimePicker"
              selected={selectedDateTime}
              onChange={handleDateChange}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeInput
              value={values.taskDue}
              name="taskDue"
            />
            
            </div>
          </ListItem>
          <ListItem sx={{justifyContent:'center'}}> {/*getting rid of MUI's stupid padding */}
            <div className="buttonWrapper">
            <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </ListItem>
          
          </Form>
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

