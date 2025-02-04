import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri';
import axios from 'axios';
import { getFacultyApi } from '../../Services/allAPI';


import { facultyApi } from '../../Services/allAPI';  

const FacultyProfile = () => {
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(null); // To track errors
    const token = localStorage.getItem('access');

    // useEffect(() => {
    //     const fetchFacultyData = async () => {
    //         if (!token) {
    //             setError('No token found in localStorage');
    //             setLoading(false);
    //             return;
    //         }

    //         try {
    //             const response = await facultyApi(token);  // Use the existing API function
    //             setFaculty(response.data); // Assuming `response.data` contains the faculty data
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching faculty data", error);
    //             setError('Failed to fetch faculty data.');
    //             setLoading(false);
    //         }
    //     };

    //     fetchFacultyData();
    // }, [token]); 
    // useEffect(() => {
    //     const fetchFacultyData = async () => {
    //       if (!token) {
    //         setError("No token found");
    //         setLoading(false);
    //         return;
    //       }
      
    //       try {
    //         const facultyData = await getFacultyApi(token);
    //         setFaculty(facultyData);
    //       } catch (error) {
    //         setError("Failed to fetch faculty data.");
    //       }
    //       setLoading(false);
    //     };
      
    //     fetchFacultyData();
    //   }, [token]);
      
      
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; // Display error if it occurs
    }

    return (
        <div className="profile mt-2 border py-3 px-3">
            <h2>PROFILE</h2>
            <div className='d-flex justify-content-end'>
                <RiEdit2Fill />
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Faculty Id </div>: 
                <div className='col-lg-5 ms-2'>{faculty.id}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Faculty Name </div>: 
                <div className='col-lg-5 ms-2'>{faculty.full_name}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>DOB </div>: 
                <div className='col-lg-5 ms-2'>{faculty.dob}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Gender </div>: 
                <div className='col-lg-5 ms-2'>{faculty.gender}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Email </div>: 
                <div className='col-lg-5 ms-2'>{faculty.email}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Phone </div>: 
                <div className='col-lg-5 ms-2'>{faculty.phone}</div>
            </div>
        </div>
    );
};

export default FacultyProfile;
