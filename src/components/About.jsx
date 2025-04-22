import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './about.css'
import './chatButton.css'
import chaticon from '../assets/chat-icon.png'
import ViewNotifications from './ViewNotifications';
import Courses from './Courses';
import ResultStd from './ResultStd';
import Departments from './Departments';
import College from './College';
import email from '../assets/email.png'
import book from '../assets/book.png'
import trophy from '../assets/wreath.png'

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

  const token = localStorage.getItem('access'); // Check for token

  return (
    <>
      <div className="container d-flex gap-3 justify-content-center my-3">
        {token && (
          <>
            <div className='About-card shadow p-2 text-center' onClick={toggleNotifications}>
              <div className='icons d-flex align-items-center justify-content-center'>
                <img src={email} style={{ width: '50px', height: '60px' }} alt="Notifications" />
              </div>
              <h5>Notifications</h5>
            </div>

            <div className='About-card p-2 shadow text-center' onClick={toggleEvents}>
              <div className='icons d-flex align-items-center justify-content-center'>
                <img src={book} style={{ width: '50px', height: '60px' }} alt="Courses" />
              </div>
              <h5>Courses</h5>
            </div>

            <div className='About-card p-2 shadow text-center' onClick={toggleResults}>
              <div className='icons d-flex align-items-center justify-content-center'>
                <img src={trophy} style={{ width: '50px', height: '60px' }} alt="Results" />
              </div>
              <h5>Results</h5>
            </div>
          </>
        )}
      </div>

      {showNotifications && (
        <div className='show-content not shadow'>
          <ViewNotifications />
        </div>
      )}

      {showEvents && (
        <div className='show-content shadow'>
          <Courses />
        </div>
      )}

      {showResults && (
        <div className='show-content shadow'>
          <ResultStd />
        </div>
      )}

      <Departments />
      <College />

      {/* Chat Button */}
      <button className="chat-button">
        <Link to={'/chat'}>
          <img src={chaticon} alt="Chat" />
        </Link>
      </button>
    </>
  )
}

export default About;
