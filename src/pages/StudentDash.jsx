import React, { useEffect, useState } from 'react';
import './styles/stddash.css';
import user from '../assets/student.jpg';
import { Link } from 'react-router-dom';
import { getNotificationsApi, getStudentApi } from '../Services/allAPI';
import { Button, Modal, Nav, Navbar } from 'react-bootstrap';
import { MdNotifications } from 'react-icons/md';
import AssignmentStd from '../components/AssignmentStd';
import Profile from '../components/Profile';
import ResultStd from '../components/ResultStd';
import StudentNoteView from '../components/StudentNoteView';
import AttendanceReport from '../components/AttendanceReport';

const StudentDash = () => {
    const [activeFeature, setActiveFeature] = useState("profile");
    const [profile, setProfile] = useState({});

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);


    useEffect(() => {
        const studentSideBar = async () => {
            const token = localStorage.getItem('access');
            let studentId = localStorage.getItem("userId");
            let userRole = localStorage.getItem("role"); 
    
            if (!token || !studentId) {
                console.log('Token or studentId not found in local storage');
                alert('Session expired. Please log in again.');
                return;
            }
    
            try {
                const response = await getStudentApi(studentId, token, userRole === "student");
                const userData = response.data;
                console.log("✅ Student Data:", userData);
    
                setProfile({
                    id: userData.student_id || "N/A",
                    full_name: userData.full_name || "N/A",
                    email: userData.email || "N/A",
                    phone: userData.phone || "N/A",
                    photo: userData.photo || user
                });
            } catch (error) {
                console.error('❌ Error fetching student profile:', error);
                alert('Failed to load profile. Please try again.');
            }
        };
        studentSideBar();
    }, []);
    

    const fetchNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            setNotifications(response.data || []);
        } catch (error) {
            console.error(' Error fetching notifications:', error);
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

    const renderFeature = () => {
        switch (activeFeature) {
            case "assignment":
                return <AssignmentStd />;
            case "result":
                return <ResultStd />;
            case "notes":
                return <StudentNoteView />;
            case "attendance":
                return <AttendanceReport />;
            default:
                return <Profile />;
        }
    };

    return (
        <section>
            <div className='backtohome d-flex justify-content-end mt-2'>
                <Link to={'/home'} className='tohome'>Back to Home</Link>
            </div>

            <Navbar expand='lg' className='dash'>
                <div className='icon-photo ms-2 d-lg-none' onClick={handlePhotoClick}>
                    <img src={profile.photo} className='img-fluid' alt="profile" />
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className='ms-auto' />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='stdOptions ms-auto me-auto mt-2'>
                        <Link onClick={() => setActiveFeature("profile")}>Profile</Link>
                        <Link onClick={() => setActiveFeature("assignment")}>Assignments</Link>
                        <Link onClick={() => setActiveFeature("notes")}>Notes</Link>
                        <Link onClick={() => setActiveFeature("attendance")}>Attendance</Link>
                        <Link onClick={() => setActiveFeature("result")}>Result</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className='d-flex row'>
                <div className="sidebar col-lg-2 col-md-4 col-sm-12 container mb-2" id='hidesidebar'>
                    <div className="photo img-fluid">
                        <img src={profile.photo} alt="User Profile" />
                    </div>
                    <div className="text-center">
                        <h3>{profile.full_name}</h3>
                        <p>Student ID: {profile.id}</p>
                        <hr />
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                    </div>
                </div>

                <div className="col-lg-9 view">
                    {renderFeature()}
                </div>
            </div>

            {/* Notifications Modal */}
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size='lg'
                show={showNotifications}
                onHide={handleCloseNotifications}
                dialogClassName="custom-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Notifications
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length > 0 ? (
                        notifications.map((n, index) => (
                            <div key={index} className="notification-item">
                                <h4>{n.title}</h4>
                                <p>{n.message}</p>
                            </div>
                        ))
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default StudentDash;
