import React, { useEffect, useState } from 'react';
import { getNotificationsApi } from '../Services/allAPI';
import { MdNotifications } from 'react-icons/md';

import './viewnotification.css';

const ViewNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    
    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsApi(token); // ✅ Directly get array
                setNotifications(data); // ✅ No need for `data.data`
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, [token]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Filter results based on search query
    const filteredNotifications = notifications.filter((notify) =>
        notify.title.toLowerCase().includes(searchQuery)
    );

    return (
        <div className='container notification-view'>
            <h1 className='notification-title'>Notifications</h1>
            <p className='text-center'>Stay updated with your academic notifications</p>

            <div className="search-bar">
                <input 
                    type="text"
                    className="search-notification w-50 p-2"
                    placeholder="🔍 Search notifications..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className='d-flex flex-column gap-2'>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n, index) => (
                        <div key={index} className='notification-card d-flex shadow gap-3'>
                            <div className='notify-icon p-3'>
                                <MdNotifications />
                            </div>
                            <div className='flex-column'>
                                <h3>{n.title}</h3>
                                <p style={{ fontSize: '15px', width: '500px' }}>{n.message}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No notifications found.</p>
                )}
            </div>
        </div>
    );
};

export default ViewNotifications;
