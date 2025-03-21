import React, { useState } from 'react'
import { TfiAnnouncement } from "react-icons/tfi";
import { MdOutlineEventNote, MdOutlineLibraryBooks } from "react-icons/md";
import { GiBlackBook } from "react-icons/gi";
import { BsTrophy } from "react-icons/bs";
import { PiExamFill } from "react-icons/pi";
import './about.css'
import './chatButton.css'
import chaticon from '../assets/chat-icon.png'
import Events from './Events';
import Courses from './Courses';
import prof1 from '../assets/proff1.jpg'
import prof3 from '../assets/proff3.jpg'
import prof4 from '../assets/proff4.jpg'
import Departments from './Departments';
import College from './College';
import { Link, useNavigate } from 'react-router-dom';
import ViewNotifications from './ViewNotifications';
import email from '../assets/email.png'
import book from '../assets/book.png'
import trophy from '../assets/wreath.png'
import ResultStd from './ResultStd';

const About = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showEvents, setShowEvents] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const toggleNotifications = () => {
    setShowNotifications(true);
    setShowResults(false)
    setShowEvents(false);

  };
  const toggleEvents = () => {
    setShowEvents(true);
    setShowNotifications(false)
    setShowResults(false)

  };
  const toggleResults = () => {
    setShowEvents(false);
    setShowNotifications(false)
    setShowResults(true)
  };
  const navigate = useNavigate()
  return (
    <>
      <div className="container d-flex gap-3 justify-content-center my-3">
        <div className='About-card shadow p-2  text-center'
          onClick={toggleNotifications}>
          <div className='icons d-flex align-items-center justify-content-center ' >
            <img src={email} style={{ width: '50px', height: '60px' }} alt="" />
          </div>
          <h5>Notifications</h5>
        </div >
    
        <div className='About-card p-2 shadow  text-center' onClick={toggleEvents}>
          <div className='icons d-flex align-items-center justify-content-center'>
            <img src={book} style={{ width: '50px', height: '60px' }} alt="" />
          </div>
          <h5>Courses</h5>
        </div>
        <div className='About-card p-2 shadow  text-center' onClick={toggleResults}>
          <div className='icons d-flex align-items-center justify-content-center'>
            <img src={trophy} style={{ width: '50px', height: '60px' }} alt="" />
          </div>
          <h5>Results</h5>
        </div>
      </div>
      {showNotifications &&
        <div className='show-content not shadow'>
          <ViewNotifications />
        </div>

      }
      {showEvents &&
        <div className='show-content shadow'>
          <Courses />
        </div>}
      {showResults &&
        <div className='show-content shadow'>
          <ResultStd />
        </div>}
      <Departments />
      <College />
      
      {/* chatbutton */}
      <button className="chat-button">
        <Link to={'/chat'}><img src={chaticon} alt="Chat" /></Link>
      </button>



    </>
  )
}

export default About