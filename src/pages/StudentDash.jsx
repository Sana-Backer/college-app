import React, { useState } from 'react';
import Header from '../components/Header';
import './styles/stddash.css';
import bg from '../assets/bgg.jpg';
import user from '../assets/user.jpg'
import { RiEdit2Fill } from "react-icons/ri";
import AssignmentStd from '../components/AssignmentStd';
import Profile from '../components/Profile';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';

const StudentDash = () => {

    const [activeFeature,setActiveFeature]= useState(null)

    const handleActiveFeature =(feature)=>{
        setActiveFeature(feature)
    }
    const renderFeature =()=>{
        switch (activeFeature) {

            case "assignment":
               return <AssignmentStd/>;
               case "result":
               return <ResultStd/> ;
               case 'notes':
                return <Notes/>
              
                
        
            default:case "profile":
            return<Profile/>
            return
        }
    }

    return (
        <section>
            {/* <div style={{ background: "Lightblue" }}>
        <Header />
      </div> */}
            {/* <div className='bg'>
        <img src={bg} alt="Background" className='bg-img' />
      </div> */}
            <div>
                <div className='dash'>
                    <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-5 '>
                        <a href="#profile" onClick={()=>handleActiveFeature("profile")}>Profile</a>
                        <a href="#assignment" onClick={()=>handleActiveFeature("assignment")}>Assignments</a>
                        <a href="#notes" onClick={()=>handleActiveFeature("notes")}>Notes</a>
                        <a href="#attendence" onClick={()=>handleActiveFeature("attendence")}>Attendance</a>
                        <a href="#result" onClick={()=>handleActiveFeature("result")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className='sidebar col-lg-2 container mb-2 '>
                        <div className='photo img-fluid'>
                            <img src={user} alt="" />
                        </div>
                        <div className='text-center'>
                            <h4>JOHN MATHEW</h4>
                            <p>student Id:3809</p>
                            <hr />
                            <p>email@gmail.com</p>
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

export default StudentDash;
