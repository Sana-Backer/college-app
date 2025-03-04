import React, { useEffect, useState } from 'react'
import { getNotificationsApi } from '../Services/allAPI';
import { MdNotifications } from 'react-icons/md';

import './viewnotification.css'

const ViewNotifications = () => {
  
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('access')
        useEffect(()=>{
            const fetchNotifications = async () => {
                try {
                    const response = await getNotificationsApi(token);
                    setNotifications(response.data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };
            fetchNotifications()
        },[token])
            
        
            // const handleShowNotifications = () => {
            //     fetchNotifications();
            //     setShowNotifications(true);
            // };
        
            // const handleCloseNotifications = () => {
            //     setShowNotifications(false);
            // };
        
    
  return (
    <div className='container'>
        <h1 className='notification-title'>Notifications</h1>
        <p className=''>Stay update with your academic notifications</p>

        <div>
        <div className='d-flex flex-column gap-2'>
        {notifications.map((n)=>(

                <div className='notification-card d-flex shadow gap-3'>
                    <div className=' notify-icon p-3'>
                       <MdNotifications/>
                    </div>
                    <div className='flex-column'>
                        <h3>{n.title} </h3>
                        <p  style={{fontSize:'15px',width:'500px'}}>{n.message}</p>
                    </div>
                </div>
        ))}
            </div>
        </div>
    </div>
  )
}
export default ViewNotifications