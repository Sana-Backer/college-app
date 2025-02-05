import React, { useState } from 'react';
import './styles/stddash.css';
import prof3 from '../assets/proff3.jpg'
import { RiArrowGoForwardLine } from "react-icons/ri";
import AssignmentStd from '../components/AssignmentStd';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import FacultyProfile from '../components/faculty/facultyProfile'
import ViewStudent from '../components/Admin/ViewStudent';
import Studentlist from '../components/hod/Studentlist';
import { useNavigate } from 'react-router-dom';
// import AddNote from '../components/faculty/AddNote';
const FacultyDash = () => {

    const [activeFeature, setActiveFeature] = useState(null)
    const navigate = useNavigate()


    const backhome = () => {
        navigate('/home')
    }

    const handleActiveFeature = (feature) => {
        setActiveFeature(feature)
    }
    const renderFeature = () => {
        switch (activeFeature) {

            case "studentlist":
                return <ViewStudent />;
            case "result":
                return <ResultStd />;
            case 'notes':
                return <AddNote />

            default: case "profile":
                return <FacultyProfile />

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
                        <a href="#assignment" onClick={() => handleActiveFeature("studentlist")}>student list</a>
                        <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
                        <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
                        <a href="#result" onClick={() => handleActiveFeature("result")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className='sidebar col-lg-2 container mb-2 '>
                        <div className='photo img-fluid'>
                            <img src={prof3} alt="" />
                        </div>
                        <div className='text-center'>
                            <h4>Miazna Ameer</h4>
                            <p>Department of civil Engineering</p>
                            <hr />
                            <p>miszna@gmail.com</p>
                            <p>908765432</p>

                        </div>
                    </div>
                    <div className="col-lg-8 view " id=''>
                        {renderFeature()}
                    </div>
                    <div className="col-lg-1"></div>

                </div>

            </div>
        </section>
    )
}

export default FacultyDash;
