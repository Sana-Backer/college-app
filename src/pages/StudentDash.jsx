import React, { useEffect, useState } from 'react';
import './styles/stddash.css';
import user from '../assets/user.jpg'
import { RiArrowGoForwardLine } from "react-icons/ri";
import AssignmentStd from '../components/AssignmentStd';
import Profile from '../components/Profile';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import { useNavigate } from 'react-router-dom';
import { getUserProfileApi, StudentApi } from '../Services/allAPI';

const StudentDash = () => {

    const [activeFeature, setActiveFeature] = useState(null)
    const [profile, setProfile] = useState({
        id:"",
        name:"",
        email:'',
        phone:''
    })


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



    return (
        <section>

            <div>
                <div className='container d-flex justify-content-end mt-1 me-auto'>
                    <a href="" onClick={backhome} className='tohome'><RiArrowGoForwardLine /> Back to Home</a>
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
        </section>
    )
}

export default StudentDash;
