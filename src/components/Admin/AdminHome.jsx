import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Container,
  Collapse, IconButton, CssBaseline, Toolbar,
  useMediaQuery
} from '@mui/material';
import {
  Menu, Add, Visibility, ExitToApp, ExpandLess, ExpandMore,
  Notifications, Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddHod from './AddHod';
import AddFaculty from './AddFaculty';
import AddStudent from './AddStudent';
import AddBatch from './AddBatch';
import AddDepartment from './AddDepartment';
import AddCourse from './AddCourse';
import ViewDepartment from './ViewDepartment';
import ViewStudent from './ViewStudent';
import ViewHod from './ViewHod';
import ViewFaculty from './ViewFaculty';
import Notification from './Notification';
import ExamResult from './ExamResult';
import './AdminHome.css';
import ViewCourses from './ViewCourses';
import ViewBatch from './ViewBatch';
import AddSubject from './AddSubject';
import ViewSubject from './ViewSubject';
import logo from '../../assets/logo.png'
function AdminHome() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); 
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const isMediumScreen = useMediaQuery('(max-width:1290px)');


  const isLargeScreen = useMediaQuery('(min-width:900px)'); 

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const handleCloseOptions = () => {
    setOpen(!open);
  };


  const handleAddClick = () => {
    setOpenAdd(!openAdd);
  };

  const handleViewClick = () => {
    setOpenView(!openView);
  };

  const renderComponent = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="admin-home">
      <CssBaseline />

      {/* Toggle Button */}
      {/* <IconButton onClick={toggleDrawer} sx={{ position: "absolute", top: 10, left: 10 }}>
        <Menu />
      </IconButton> */}
      <Drawer
        className="admin-drawer"
        variant={isLargeScreen ? "permanent" : "temporary"} 
        anchor="left"
        open={isLargeScreen || open}
        onClose={isLargeScreen ? undefined : toggleDrawer} 
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isLargeScreen ? 240 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >


        <Toolbar />
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center' }}>

          <span>Admin Controls</span>
        </div>
        {/*  */}


        <List>
          {/* Add Section */}
          <ListItem button className="list-item" onClick={handleAddClick}>
            <ListItemIcon><Add /></ListItemIcon>
            <ListItemText primary="Add" />
            {openAdd ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAdd} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddHod />)}>
                <ListItemText primary="Add HOD"
                  onClick={handleCloseOptions} />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddFaculty />)}>
                <ListItemText primary="Add Faculty" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddStudent />)}>
                <ListItemText primary="Add Student"
                // onClick={toggleDrawerClose}
                />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddCourse />)}>
                <ListItemText primary="Add Course" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddSubject />)}>
                <ListItemText primary="Add Subject" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddBatch />)}>
                <ListItemText primary="Add Batch" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddDepartment />)}>
                <ListItemText primary="Add Department" />
              </ListItem>
            </List>
          </Collapse>

          {/* View Section */}
          <ListItem button className="list-item" onClick={handleViewClick}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText primary="View" />
            {openView ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openView} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewHod />)}>
                <ListItemText primary="View HOD" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewFaculty />)}>
                <ListItemText primary="View Faculty" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewStudent />)}>
                <ListItemText primary="View Student" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewDepartment />)}>
                <ListItemText primary="View Department" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewCourses />)}>
                <ListItemText primary="View Course" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewSubject />)}>
                <ListItemText primary="View subject" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewBatch />)}>
                <ListItemText primary="View Batch" />
              </ListItem>
            </List>
          </Collapse>

          {/* Notifications & Exam Results */}
          <ListItem button className="list-item" onClick={() => renderComponent(<Notification />)}>
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="Notification" />
          </ListItem>

          <ListItem button className="list-item" onClick={() => renderComponent(<ExamResult />)}>
            <ListItemIcon><Assessment /></ListItemIcon>
            <ListItemText primary="Exam Result" />
          </ListItem>

          {/* Logout */}
          <ListItem button className="list-item" onClick={() => navigate('/')}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <main className="admin-content" style={{
        maxWidth: isMediumScreen ? '1100px' : '100%',
        marginLeft: isLargeScreen ? '240px' : '0'
      }}>
        <div className="toolbar-spacer" />
        <Container>
          <IconButton
            onClick={toggleDrawer}
            sx={{ marginRight: 1, display: { xs: 'block', md: 'none' } }}
          >
            <Menu />
          </IconButton>
          <div className='m-auto d-flex flex-column align-items-center mb-2 '>
            <img src={logo} className='' style={{ width: '150px', borderRadius: '90px' }} alt="" />

            <h1 className='my-2'>Welcome  <span className='text-primary'>Admin</span></h1>
          </div>

          {selectedComponent}
        </Container>
      </main>
    </div>
  );
}

export default AdminHome;
