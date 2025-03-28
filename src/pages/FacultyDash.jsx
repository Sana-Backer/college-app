import React, { useEffect, useState } from 'react';
import './fadash.css';
import { Link, useNavigate } from 'react-router-dom';
import prof3 from '../assets/proff3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { Button, Modal, Nav, Navbar } from 'react-bootstrap';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import FacultyProfile from '../components/faculty/FacultyProfile';
import ViewStudent from '../components/Admin/ViewStudent';
import AddStudent from '../components/Admin/AddStudent';
import AddAssignment from '../components/AddAssignment';
import AddNote from '../components/hod/AddNote';
import StudentAttendence from '../components/faculty/StudentAttendence'
import AttendenceViewStd from '../components/faculty/AttendenceSheetStd'
import { toast } from 'react-toastify';
import { departmentApi, getNotificationsApi, getNotificationsbyHodApi, getUserProfileApi } from '../Services/allAPI';
import AssignmentView from '../components/AssignmentView';

const FacultyDash = () => {
    const serverUrl = 'http://localhost:8000';

    const [activeFeature, setActiveFeature] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate()
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("N/A"); // New state for department name

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await departmentApi();
                setDepartments(response.data);
            } catch (error) {
                console.log("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);



    useEffect(() => {
        const ProfileDetails = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                toast.error('No token or user ID found in localStorage.');
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token);
                const profileData = response.data;
                setProfile({
                    full_name: profileData.user.full_name,
                    department: profileData.department,
                    email: profileData.user.email,
                    phone: profileData.user.phone,
                    photo: profileData.photo ? `${serverUrl}${profileData.photo}` : ''
                });
                 console.log('profile data', profileData);

            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to fetch profile data.');
            }
        };

        ProfileDetails();
    }, []);
    
    useEffect(() => {
        if (profile.department && departments.length > 0) {
            const foundDepartment = departments.find(dept => dept.id === profile.department);
            setDepartmentName(foundDepartment ? foundDepartment.department_name : "N/A");
        }
    }, [profile.department, departments]); 

    const handleActiveFeature = (feature) => {
        setActiveFeature(feature);
    };

    const renderFeature = () => {
        switch (activeFeature) {
            case "students":
                return <ViewStudent />;
            case "assignments":
                return <AssignmentView />;
            case "result":
                return <ResultStd />;
            case "notes":
                return <Notes />;
            case "attendence":
                return <StudentAttendence />;

            default:
            case "profile":
                return <FacultyProfile />;
        }
    };

    const handleAddStudent = () => {
        setShowForm("Student");
        setShowModal(true);
        setShowActionMenu(false);
    };

    const handleAddNote = () => {
        setShowForm("Note");
        setShowModal(true);
        setShowActionMenu(false);
    };
    const handleAddAssignment = () => {
        setShowForm("Assignment");
        setShowModal(true);
        setShowActionMenu(false);
    };


    const handleModalClose = () => {
        setShowModal(false);
        setShowForm(null);
    };

    const toggleActionMenu = () => {
        setShowActionMenu(!showActionMenu);
    };

       const fetchNotifications = async () => {
           const token = localStorage.getItem("access");
           try {
               const response = await getNotificationsbyHodApi(token);
               setNotifications(response);
           } catch (error) {
               console.error("Error fetching notifications:", error);
               toast.error("Failed to fetch notifications.");
           }
       };
   
       const handleShowNotifications = () => {
           fetchNotifications();
           setShowNotifications(true);
       };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    const handlePhotoClick = () => {
        setSidebarVisible(!sidebarVisible);
    };


    return (
        <div className="faculty-dashboard">
            <div className='backtohome  d-flex justify-content-end mt-2 '>
                <Link to={'/home'} className='tohome'>
                    Back to Home</Link>
            </div>

            <Navbar expand='lg' className="navigation-menu">
                <div className='icon-photo ms-2 d-lg-none' onClick={handlePhotoClick}>
                    <img src={profile.photo} className='img-fluid' alt="profile" />
                </div>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className='ms-auto' />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="nav-links ms-auto me-auto">
                        <a
                            href="#profile"
                            onClick={() => handleActiveFeature("profile")}
                            className={activeFeature === "profile" ? "active" : ""}
                        >
                            Profile
                        </a>
                        <a
                            href="#students"
                            onClick={() => handleActiveFeature("students")}
                            className={activeFeature === "students" ? "active" : ""}
                        >
                            All Students
                        </a>
                        <a
                            href="#notes"
                            onClick={() => handleActiveFeature("notes")}
                            className={activeFeature === "notes" ? "active" : ""}
                        >
                            Notes
                        </a>
                        <a
                            href="#assignments"
                            onClick={() => handleActiveFeature("assignments")}
                            className={activeFeature === "assignments" ? "active" : ""}
                        >
                            Assignments
                        </a>
                        <a
                            href="#attendence"
                            onClick={() => handleActiveFeature("attendence")}
                            className={activeFeature === "attendence" ? "active" : ""}
                        >
                            Student Attendance
                        </a>
                        <a
                            href="#result"
                            onClick={() => handleActiveFeature("result")}
                            className={activeFeature === "result" ? "active" : ""}
                        >
                            Result
                        </a>
                        <MdNotifications className="notification-btn mt-2" onClick={handleShowNotifications} />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
          
            <div className="dashboard-content">
                <aside className="profile-sidebar" id='hidesidebar'>
                    <div className="profile-image">
                        <img src={profile.photo} alt="Profile" />
                    </div>
                    <div className="profile-info">
                        <h4>{profile.full_name}</h4>
                        <p>{departmentName}</p>
                        <hr />
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                    </div>
                </aside>

                <main className="main-content">
                    {renderFeature()}
                </main>
            </div>
            <button className="floating-action-btn" onClick={toggleActionMenu}>
                <FaPlus />
            </button>

            {showActionMenu && (
                <div className="action-menu-container">
                    <Button variant="primary" onClick={handleAddStudent}>
                        Add Student
                    </Button>

                    <Button variant="info" onClick={handleAddNote}>
                        Add Note
                    </Button>
                    <Button variant="success" onClick={handleAddAssignment}>
                        Add Assignment
                    </Button>
                </div>
            )}
            {/* Modal for Adding Student or Note */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {showForm ? `Add ${showForm}` : "Select Action"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showForm ? (
                        <div className="d-flex justify-content-around">
                            <Button variant="primary" onClick={handleAddStudent}>
                                Add Student
                            </Button>
                            <Button variant="success" onClick={handleAddNote}>
                                Add Note
                            </Button>
                            <Button variant="success" onClick={handleAddAssignment}>
                                Add Assignment
                            </Button>
                        </div>
                    ) : showForm === "Student" ? (
                        <AddStudent onClose={handleModalClose} />
                    ) : showForm === "Note" ? (
                        <AddNote onClose={handleModalClose} />
                    ) : showForm === "Assignment" ? (
                        <AddAssignment role="Faculty" username={profile.full_name} />
                    ) : null}
                </Modal.Body>

            </Modal>

            {/* Notifications Modal */}
            <Modal show={showNotifications} onHide={() => setShowNotifications(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Notifications</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {notifications.length ? notifications.map((n, i) => (
                                    <div key={i}><h5>{n.title}</h5><p>{n.message}</p></div>
                                )) : <p>No notifications available.</p>}
                            </Modal.Body>
                        </Modal>
        </div>
    );
};

export default FacultyDash;