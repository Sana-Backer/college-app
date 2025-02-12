import React, { useEffect, useState } from 'react';
import './styles/stddash.css';
import user from '../assets/user.jpg'
import { RiArrowGoForwardLine } from "react-icons/ri";
import AssignmentStd from '../components/AssignmentStd';
import Profile from '../components/Profile';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import { useNavigate } from 'react-router-dom';
import { getNotificationsApi, getUserProfileApi, StudentApi } from '../Services/allAPI';
import { MdNotifications } from 'react-icons/md';
import { Modal } from 'react-bootstrap';

const StudentDash = () => {

    const [activeFeature, setActiveFeature] = useState(null)
    const [profile, setProfile] = useState({
        id:"",
        name:"",
        email:'',
        phone:''
    })
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);


    const handleActiveFeature = (feature) => {
        setActiveFeature(feature)
    }
    const renderFeature = () => {
        switch (activeFeature) {

            case "assignment":
                return <AssignmentStd />;
            case "result":
                return <ResultStd />;
            case 'notes':
                return <Notes />


            default: case "profile":
                return <Profile />
                
        }
    }
    const navigate = useNavigate()
    const backhome = () => {
        navigate('/home')
    }

    useEffect(() => {
        const studentSideBar = async()=>{
            const token = localStorage.getItem('access')
            const userId = localStorage.getItem('userId')
            if(! token || ! userId){
                console.log('token / userid not found in local storage');
                return        
            }
            try {
                const response = await getUserProfileApi(userId, token)
                const userData = response.data
                console.log(userData);
                
                setProfile({
                    id: userData.id,
                    full_name: userData.full_name,
                    department: userData.department,
                    email: userData.email,
                    phone: userData.phone

                })

            } catch (error) {
                console.log('error fetching student profile',error);
                
            }
        }
        studentSideBar()
    },[])
    const fetchNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleShowNotifications = () => {
        fetchNotifications();
        setShowNotifications(true);
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };



    return (
        <section>

            <div>
                <div className='container d-flex justify-content-end mt-1 me-auto'>
                    <a href="" onClick={backhome} className='tohome'><RiArrowGoForwardLine /> Back to Home</a>
                    <MdNotifications 
                    className="notification-btn" 
                    onClick={handleShowNotifications}
                />
                </div>
                <div className='dash'>

                    <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2 '>
                        <a href="#profile" onClick={() => handleActiveFeature("profile")}>Profile</a>
                        <a href="#assignment" onClick={() => handleActiveFeature("assignment")}>Assignments</a>
                        <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
                        <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
                        <a href="#result" onClick={() => handleActiveFeature("result")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className="sidebar  col-lg-2 col-md-4 col-sm-12 container mb-2">
                        <div className="photo img-fluid">
                            <img src={user} alt="User Profile" />
                        </div>
                        <div className="text-center">
                            <h4>name{profile.name}</h4>
                            <p>Student Id: 3809</p>
                            <hr />
                            <p>email{profile.email}</p>
                            <p>9898989898{profile.phone}</p>
                        </div>
                    </div>

                    <div className="col-lg-9 view " id=''>
                        {renderFeature()}
                    </div>


                </div>

            </div>
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
        </section>
    )
}

export default StudentDash;
