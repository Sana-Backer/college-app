import React, { useEffect, useState } from 'react';
import './fadash.css';
import { useNavigate } from 'react-router-dom';
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
import { getNotificationsApi, getUserProfileApi } from '../Services/allAPI';
import AssignmentView from '../components/AssignmentView';

const FacultyDash = () => {
    const serverUrl = 'http://localhost:8000';

    const [activeFeature, setActiveFeature] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState({
        full_name: '',
        department: '',
        email: '',
        phone: '',
        photo: null
    });
    const navigate = useNavigate()
    const [sidebarVisible, setSidebarVisible] = useState(false);


    const backhome = () => {
        navigate('/home')
    }

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
                    full_name: profileData.full_name,
                    department: profileData.department,
                    email: profileData.email,
                    phone: profileData.phone,
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
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications.');
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
            <div className="faculty-header">
                <p className="back-link" onClick={backhome}>
                    <RiArrowGoForwardLine /> Back to Home
                </p>
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
                        <MdNotifications
                            className="notification-btn"
                            onClick={handleShowNotifications}
                        />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {/* Profile Sidebar - positioned below the navbar */}
            {sidebarVisible && (
                <aside className="profile-sidebar">
                    <div className="profile-image">
                        {profile.photo ? (
                            <img src={profile.photo} alt="Profile"  />
                        ) : (
                           ' no image'
                        )}
                    </div>
                    <div className="profile-info">
                        <h4>{profile.full_name}</h4>
                        <p>{profile.department}</p>
                        <hr />
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                    </div>
                </aside>
            )}


            <div className="dashboard-content">
                <aside className="profile-sidebar" id='hidesidebar'>
                    <div className="profile-image">
                        <img src={profile.photo} alt="Profile" />
                    </div>
                    <div className="profile-info">
                        <h4>{profile.full_name}</h4>
                        <p>{profile.department}</p>
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
            <Modal show={showNotifications} onHide={handleCloseNotifications} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length > 0 ? (
                        <ul className="notification-list">
                            {notifications.map((notification, index) => (
                                <li key={index} className="notification-item">
                                    <h5>{notification.title}</h5>
                                    <p>{notification.message}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FacultyDash;