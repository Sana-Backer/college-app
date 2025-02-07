import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri';
import './profile.css';
import { getUserProfileApi } from '../Services/allAPI';

const Profile = () => {
  const [stdDetails, setStdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
         const studentProfile = async () => {
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
                 
                 setStdDetails({
                     id: userData.id,
                     full_name: userData.full_name,
                     dob: userData.dob,
                     gender: userData.gender,
                     batch: userData.batch,
                     department: userData.department,
                     couser: userData.course,
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
         studentProfile()
     }, [])
 
 
     if (loading) {
         return <div>Loading...</div>;
     }
 
     if (error) {
         return <div>{error}</div>; // Display error if it occurs
     }

  return (
    <div className="profile mt-2 border py-3 px-3">
      <h2>PROFILE</h2>
      <div className='d-flex justify-content-end'><RiEdit2Fill /></div>

      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Student Id </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.id || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Student Name </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.full_name || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Batch </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.batch || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Department </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.department || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Course </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.course || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>DOB </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.dob || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Gender </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.gender || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Email </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.email || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Phone </div>:
        <div className='col-lg-5 ms-2'>{stdDetails.phone || 'N/A'}</div>
      </div>
    </div>
  );
};

export default Profile;
