import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { addNotificationApi, updateNotificationApi, deleteNotificationApi, getNotificationsApi, StudentApi } from '../../Services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notif.css';
import { FaEdit, FaEye } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

const Notification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('');
    const [recipientIds, setRecipientIds] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        allNotifications();
    }, []);



    const allNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            console.log("API Response:", response); // ✅ Debugging
    
            // If response itself is an array, directly set notifications
            if (Array.isArray(response)) {
                setNotifications(response); // ✅ Corrected
            } else if (response?.data && Array.isArray(response.data)) {
                setNotifications(response.data); // ✅ Handles both cases
            } else {
                console.error("Invalid response format:", response);
                setNotifications([]); // ✅ Avoids errors
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications.');
            setNotifications([]); // ✅ Ensures no undefined errors
        }
    };
        const handleSendNotification = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');

        const data = {
            title,
            message,
            recipientType,
            // recipientIds: recipientType === 'particularStudent' ? recipientIds : []
        };

        try {
            if (selectedNotification) {
                const response = await updateNotificationApi(selectedNotification.id, data, token);
                if (response.status === 200) {
                    toast.success('Notification updated successfully!');
                    setSelectedNotification(null);
                } else {
                    toast.error('Failed to update notification.');
                }
            } else {
                const response = await addNotificationApi(data, token);
                if (response.status === 201) {
                    toast.success('Notification sent successfully!');
                } else {
                    toast.error('Failed to send notification.');
                }
            }
            setTitle('');
            setMessage('');
            setRecipientType('');
            setRecipientIds([]);
            allNotifications();
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification.');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        const token = localStorage.getItem('access');
        try {
            const response = await deleteNotificationApi(notificationId, token);
            if (response.status === 204) {
                setNotifications(notifications.filter(notification => notification.id !== notificationId));
                toast.success('Notification deleted successfully.');
            } else if (response.status === 404) {
                toast.error('Notification not found.');
            } else {
                toast.error('Failed to delete notification.');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification.');
        }
    };

    const handleEditNotification = (notification) => {
        setSelectedNotification(notification);
        setTitle(notification.title);
        setMessage(notification.message);
        setRecipientType(notification.recipientType);
        setRecipientIds(notification.recipientIds || []);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="send-notification-page">
            <h2>{selectedNotification ? 'Edit Notification' : 'Send Notification'}</h2>
            <form onSubmit={handleSendNotification}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="recipientType">Send To</label>
                    <select
                        id="recipientType"
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        required
                    >
                        <option value="">Select recipient type</option>
                        <option value="all">All</option>
                        <option value="faculty">Faculty</option>
                        <option value="allStudents">All Students</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">{selectedNotification ? 'Update' : 'Send'}</button>
            </form>

            <button className="viewnotification" onClick={toggleNotifications}>
                <FaEye /> {showNotifications ? 'Hide Notifications' : 'View Notifications'}
            </button>
            <ToastContainer />
            {/* ✅ Fix: Check if notifications is defined before accessing .length */}
            {showNotifications && Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map(notification => (
                    <div key={notification.id} className="notifications">
                        <div>
                            <h3>{notification.title}</h3>
                            <p>{notification.message}</p>
                        </div>
                        <div className="notification-actions">
                            <button className="n-edit" onClick={() => handleEditNotification(notification)}>
                                <FaEdit />
                            </button>
                            <button className="n-delete" onClick={() => handleDeleteNotification(notification.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
               <></>
            )}


        </div>
    );
};

export default Notification;