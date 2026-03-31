import "@/components/navbar/navbar.css";
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import AddCircleItem from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from "react-router-dom";
import sleep from "../../misc/sleep.jsx";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { DataGrid }  from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";





//https://mui.com/material-ui/react-drawer/

const drawerWidth = 240;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({isOpen, onOpenChange, onChangeTask, onActiveList, listNames, userID}) {
  const navigate = useNavigate();  
    
    const handleLogout = async() =>{
        await axios.post("http://localhost:4000/auth/logout")
        await sleep(1000);
        navigate("/home")
    }


  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState("first");

  

  // const [listNames, setListNames] = React.useState([]);
  // React.useEffect(()=>{
  //   const getListNames = async() => {
  //     try{
  //       const {data} = await axios.get("http://localhost:4000/auth/boxnames", { credentials: "include" })
  //       setListNames(data);
  //       console.log(data);

  //     }catch (err) {
  //     console.log(err)
  //   }}
  // getListNames()}, []) 

  // only need this fetch on page load - using dependency array




  
  const [modalShow, setModalShow] = React.useState(false);

  const handleModalClose = () => {
    setModalShow(false);
    setActiveTab("first");
  };
  const handleModalShow = () => setModalShow(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const openChangeTaskChange = () => {
    onOpenChange(!isOpen);
    onChangeTask(null);
  }

  // const getListID = (item) =>{
  //   console.log(item.list_id);
  //   return item.list_id
  // }


  





  // DATA GRID

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowUpdate = async(newRow, oldRow) => {
    try{
      const res = await axios.post("http://localhost:4000/auth/updateTag", {tag_id: newRow.tag_id, tag_name: newRow.tag_name, user_id: userID})

      console.log("DB updated:", res.data)
      fetchTags();

      return newRow;
    } catch (err) {
    console.log("Error updating tag:", err)
    return oldRow; //rollback
  }
}

  const [rows, setRows] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  const [sortModel, setSortModel] = React.useState([]);
  const [displayDataGrid, setDisplayDataGrid] = React.useState(false);


    const fetchTags = async() => {
      console.log("RUNNING FETCH TAGS")
      try{
        console.log("USER ID IN FETCH TAGS:", userID)
        const res  = await axios.get('http://localhost:4000/auth/tags', {params: {user_id: userID}})
        console.log("USER ID:", userID)
        setRows(res.data)
        console.log("rows:", res.data);
        console.log("tags:", res.data);
      }catch (err) {
        console.log("failed to fetch tags:", err)
      }
    }

const onbuttonClickDelete = async(row) => {

  try{
    console.log("deleting tag with id:", row.tag_id)
    const res = await axios.post("http://localhost:4000/auth/deleteTag", { params: {tag_id: row.tag_id, user_id: userID}})
    console.log("tag deleted:", res.data)
    setRows((prevRows) => prevRows.filter((r) => r.tag_id !== row.tag_id)) // filtering from previous rows to show user instant deletion
    fetchTags();
  } catch (err) {
    console.log("Error deleting tag:", err)
  }
}

const addNewRow = async() => {
  try {
    const res = await axios.post("http://localhost:4000/auth/createTag", {tag_name: "New Tag", user_id: userID})
    const newRow = { tag_id: res.data.tagId, tag_name: "New Tag" };
    setRows((prevRows) => [...prevRows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [res.data.tagId]: {mode: 'edit', fieldToFocus: 'tag_name'},
    }));
    console.log("DB updated:", res.data)
    fetchTags(); // fetch - avoid renaming new tags to "new tag" if multiple tags were created
  } catch (err) {
    console.log("Error creating tag:", err)
  }

}; // https://www.reddit.com/r/learnreactjs/comments/wmpvvn/comment/ik1wjrq/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
// https://codesandbox.io/p/sandbox/crud-try-3-0htzso


const columns = [
  {
    field: 'tag_name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    width: 150,
    getActions: (params) => {
      return [
        <IconButton onClick = {()=> onbuttonClickDelete(params.row)} color="error">
          <DeleteIcon />
        </IconButton>
      ]
    },
  },

];




  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >


        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={()=> openChangeTaskChange()}>
              <ListItemIcon>
                <AddCircleItem/>
              </ListItemIcon>
              <ListItemText primary={"New Task"}/>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          {listNames.map((item) => (
            <ListItem key={item.list_id} disablePadding>
              <ListItemButton onClick={()=>onActiveList(item.list_id)}>
                <ListItemIcon>
                  {item.list_id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={item.list_name} />
              </ListItemButton>
            </ListItem> 
          ))}
        </List>



        <Divider />


        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List style={{ position: "absolute", bottom: "0" }}> 
            <ListItem disablePadding>
              <ListItemButton onClick={handleModalShow}>
                <ListItemIcon>
                  <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary={"Settings"}/>
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>



      <Main open={open}>
        <DrawerHeader />




      </Main>
      <>
      <Modal dialogClassName="settingsDialog" className="settingsModal" size="lg" show={modalShow} onHide={handleModalClose} >
        <Modal.Header closeButton>
          <Modal.Title style={{width:'100%', textAlign: 'center'}}>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={(e) => {setActiveTab(e); if (e==="second") {fetchTags();}}}>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Tab 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Tab 2</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first"><Button onClick={handleLogout }>Logout</Button></Tab.Pane>
            <Tab.Pane eventKey="second" style={{width:'100%', height:'100%', flexDirection:'column', textAlign:'center'}}>Edit Tags
              <Box sx={{ height: 400, width: '100%' }}>
      {activeTab === "second" &&( // fixing error where datagrid wouldn't render properly as modal didn't have a height. 
         <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}        
        getRowId={(row)=> row.tag_id}
        processRowUpdate={handleRowUpdate}
        slots={{
          footer:() => (<Button onClick={addNewRow}>Add New Tag</Button>
          )
        }}
        disableRowSelectionOnClick
      />)}
    </Box>

            </Tab.Pane>
          </Tab.Content>

        </Col>
      </Row>
    </Tab.Container>
        </Modal.Body>
      </Modal>
      </>
    </Box>
  );
}