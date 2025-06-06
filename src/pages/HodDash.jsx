import React, { useEffect, useState } from 'react';
import prof3 from '../assets/proff3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { Modal, Button, Navbar, Nav } from 'react-bootstrap';
import ViewStudent from '../components/Admin/ViewStudent';
import ViewFaculty from '../components/Admin/ViewFaculty';
import Notes from '../components/Notes';
import HodProfile from '../components/hod/HodProfile';
import AddStudent from '../components/Admin/AddStudent';
import AddFaculty from '../components/Admin/AddFaculty';
import AddDepartment from '../components/Admin/AddDepartment';
import AddNote from '../components/hod/AddNote';
import AddNotification from '../components/hod/NotificationtoFac'
import Notification from '../components/Admin/Notification';
import FacultyAttendenceMark from '../components/hod/FacultyAttendenceMark';
import { getUserProfileApi, departmentApi } from '.././Services/allAPI';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AssignmentView from '../components/AssignmentView'
import './hoddash.css'
import AddAssignment from '../components/AddAssignment';

const HodDash = () => {
    const [activeFeature, setActiveFeature] = useState("profile");
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [profile, setProfile] = useState({
        full_name: '',
        department: '',
        email: '',
        phone: '',
        photo: ''
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                toast.error('Authentication error: Missing token or user ID.');
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token);
                const profileData = response.data;

                setProfile({
                    full_name: profileData.full_name || "N/A",
                    email: profileData.email || "N/A",
                    phone: profileData.phone || "N/A",
                    photo: profileData.photo || prof3,
                    department: profileData.department?.id || "N/A"  // Ensure department name is fetched
                });
                console.log(profileData);

            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to fetch profile data.');
            }
        };

        fetchProfileDetails();
    }, []);


    const handleActiveFeature = (feature) => {
        setShowNotifications(false);
        setActiveFeature(feature || "profile");
    };

    const renderFeature = () => {
        if (showNotifications) {
            return <Notification notifications={notifications} onClose={handleCloseNotifications} />;
        }

        switch (activeFeature) {
            case "students":
                return <ViewStudent />;
            case "faculties":
                return <ViewFaculty />;
            case "attendenceMark":
                return <FacultyAttendenceMark />;
            case "assignments":
                return <AssignmentView />;

            default:
                return <HodProfile />;
        }
    };

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowForm(null);
    };

    const handleShowNotifications = () => {
        setShowNotifications(true);
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    const handlePhotoClick = () => {
        setSidebarVisible(!sidebarVisible); 
    };

    return (
        <div className=''>
            <div className='backtohome  d-flex justify-content-end mt-2 '>
                <Link to={'/home'} className='tohome'>
                    Back to Home</Link>
            </div>
            <Navbar expand="lg" className="navigation-menu">
                <div className='icon-photo ms-2 d-lg-none' onClick={handlePhotoClick}>
                    <img src={profile.photo} className='img-fluid' alt="profile" />
                </div>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className='ms-auto' />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="nav-links ms-auto me-auto mt-2">
                        <a
                            href="#profile"
                            onClick={() => handleActiveFeature("profile")}
                            className={activeFeature === "profile" ? "active" : ""}
                        >
                            Profile
                        </a>
                        <a
                            href="#faculties"
                            onClick={() => handleActiveFeature("faculties")}
                            className={activeFeature === "faculties" ? "active" : ""}
                        >
                            All Faculty
                        </a>
                        <a
                            href="#students"
                            onClick={() => handleActiveFeature("students")}
                            className={activeFeature === "students" ? "active" : ""}
                        >
                            All Students
                        </a>

                        <a
                            href="#assignments"
                            onClick={() => handleActiveFeature("assignments")}
                            className={activeFeature === "assignments" ? "active" : ""}
                        >
                            Assignments
                        </a>
                        <a
                            href="#notes"
                            onClick={() => handleActiveFeature("notes")}
                            className={activeFeature === "notes" ? "active" : ""}
                        >
                            Notes
                        </a>
                        <a
                            href="#attendenceMark"
                            onClick={() => handleActiveFeature("attendenceMark")}
                            className={activeFeature === "attendenceMark" ? "active" : ""}
                        >
                            Faculty Attendance
                        </a>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>



            <div className="dashboard-content">
                <aside className="profile-sidebar" id='hidesidebar'>
                    <div className="profile-image img-fluid">
                        <img src={profile.photo} alt="Profile" />
                    </div>
                    <div className="profile-info">
                        <h3>{profile.full_name}</h3>
                        <hr />
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                    </div>
                </aside>

                {/* Main content */}
                <main className="main-content">
                    {renderFeature()}
                </main>
            </div>

            <button className="floating-action-btn" onClick={handleAddUser}>
                <FaPlus />
            </button>

            <Modal show={showModal} onHide={handleModalClose} centered className="custom-modal">
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title>{showForm ? `Add ${showForm}` : "Select User Type"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    {!showForm ? (
                        <div className="d-flex justify-content-around">
                            <Button variant="primary" onClick={() => setShowForm("Student")} className="custom-button m-2">
                                Add Student
                            </Button>
                            <Button variant="success" onClick={() => setShowForm("Faculty")} className="custom-button m-2">
                                Add Faculty
                            </Button>
                            <Button variant="warning" onClick={() => setShowForm("Department")} className="custom-button m-2">
                                Add Department
                            </Button>
                            <Button variant="success" onClick={() => setShowForm("Note")} className="custom-button m-2">
                                Add Note
                            </Button>
                            <Button variant="danger" onClick={() => setShowForm("Notification")} className="custom-button m-2">
                                Add Notification
                            </Button>
                        </div>
                    ) : showForm === "Student" ? (
                        <AddStudent onClose={handleModalClose} />
                    ) : showForm === "Faculty" ? (
                        <AddFaculty onClose={handleModalClose} />
                    ) : showForm === "Department" ? (
                        <AddDepartment onClose={handleModalClose} />
                    ) : showForm === "Notes" ? (
                        <AddNote onClose={handleModalClose} />
                    ) : showForm === "Notification" ? (
                        <AddNotification onClose={handleModalClose} />
                    ) : null}
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default HodDash;
