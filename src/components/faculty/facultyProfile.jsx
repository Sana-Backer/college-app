import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri';
import axios from 'axios';
import { getUserProfileApi } from '../../Services/allAPI';



const FacultyProfile = () => {
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(null); // To track errors



    useEffect(() => {
        const facultyProfile = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId')
            if (!token || !userId) {
                setError("token or user ID not found in localStorage. ")
                setLoading(false)
                return
            }
            try {
                const response = await getUserProfileApi(userId, token)
                const userData = response.data
                console.log(userData);
                
                setFaculty({
                    id: userData.id,
                    full_name: userData.full_name,
                    dob: userData.dob,
                    gender: userData.gender,
                    department: userData.department_name,
                    course: userData.course_name,
                    email: userData.email,
                    phone: userData.phone

                })
                setLoading(false)

            } catch (error) {
                console.log('failed to fetch faculty details', error);

                setError('failed to fetch faculty details');
                setLoading(false)

            }
        }
        facultyProfile()
    }, [])


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; // Display error if it occurs
    }

    return (
        <div className="profile mt-2 border py-3 px-3">
            <h2 className='profile-title'>PROFILE</h2>
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Faculty Name </div>:
                <div className='col-lg-5 ms-2'>{faculty.full_name}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Gender </div>:
                <div className='col-lg-5 ms-2'>{faculty.gender}</div>
            </div>
            <hr />
            <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>DOB </div>:
                <div className='col-lg-5 ms-2'>{faculty.dob}</div>
            </div>
            <hr /> <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Department </div>:
                <div className='col-lg-5 ms-2'>{faculty.department}</div>
            </div>
            <hr /> <div className='profile-details d-flex flex-row'>
                <div className='col-lg-3'>Course </div>:
                <div className='col-lg-5 ms-2'>{faculty.course}</div>
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