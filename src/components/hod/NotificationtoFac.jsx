import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getNotificationsbyHodApi, sendNotificationtoFacApi } from '../../Services/allAPI';
// import { sendNotificationApi, getNotificationsApi } from '../Services/allAPI';

const NotificationtoFac = () => {
    // State for form inputs
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Function to handle form submission
    const handleSendNotification = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access'); // Get token from local storage

        if (!token) {
            toast.error('No access token found. Please log in.');
            return;
        }

        try {
            const response = await sendNotificationtoFacApi({ title, message }, token);
            if (response.status === 201) {
                toast.success('Notification sent successfully!');
                setTitle('');
                setMessage('');
                fetchNotifications(); // Refresh notifications after sending
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification.');
        }
    };

// Function to fetch notifications
const fetchNotifications = async () => {
    const token = localStorage.getItem("access");

    try {
        const notifications = await getNotificationsbyHodApi(token); // Directly receive filtered data
        setNotifications(notifications); // Set state without accessing `.data`
    } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications.");
    }
};


    useEffect(() => {
        fetchNotifications();
    }, []);

    // Toggle notification list visibility
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="send-notification-page">
            <h2>Send Notification to Faculty</h2>
            <form onSubmit={handleSendNotification}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="form-control"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
            </form>

            {/* Button to view notifications */}
            <button className="btn btn-secondary mt-3" onClick={toggleNotifications}>
                <FaEye /> {showNotifications ? 'Hide Notifications' : 'View Notifications'}
            </button>

            {/* Display Notifications */}
            {showNotifications && (
                <div className="notification-list mt-3">
                    <h4>Notifications</h4>
                    {notifications.length > 0 ? (
                        <ul className="list-group">
                            {notifications.map((notification, index) => (
                                <li key={index} className="list-group-item">
                                    <h5>{notification.title}</h5>
                                    <p>{notification.message}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationtoFac;
