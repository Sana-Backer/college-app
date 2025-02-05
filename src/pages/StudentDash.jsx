import React, { useEffect, useState } from 'react';
import './styles/stddash.css';
import user from '../assets/user.jpg'
import { RiArrowGoForwardLine } from "react-icons/ri";
import AssignmentStd from '../components/AssignmentStd';
import Profile from '../components/Profile';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import { useNavigate } from 'react-router-dom';
import { StudentApi } from '../Services/allAPI';

const StudentDash = () => {

    const [activeFeature, setActiveFeature] = useState(null)
    const [profile, setProfile] = useState([])


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
                return
        }
    }
    const navigate = useNavigate()
    const backhome = () => {
        navigate('/home')
    }

    useEffect(() => {
        dashView()
    }, [])

    const dashView = async () => {
        const token = localStorage.getItem('access')
        if (!token) {
            console.log("no token found");
        }
        try {
            const response = await StudentApi()
            setProfile(response.data)

        } catch (err) {
            console.log("failed to fetch", err);


        }

    }


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
                            <h4>JOHN MATHEW</h4>
                            <p>Student Id: 3809</p>
                            <hr />
                            <p>email@gmail.com</p>
                            <p>908765432</p>
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
