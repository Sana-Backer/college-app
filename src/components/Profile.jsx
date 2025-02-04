import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri';
import './profile.css';
import { StudentApi } from '../Services/allAPI';

const Profile = () => {
  const [stdProfile, setStdProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentDetails();
  }, []);

  const studentDetails = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('No token found in localStorage');
      setLoading(false);
      return;
    }
    try {
      const response = await StudentApi(token);
      setStdProfile(response.data);
    } catch (err) {
      setError('Error fetching student details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!stdProfile) return <p>No student data available</p>;

  return (
    <div className="profile mt-2 border py-3 px-3">
      <h2>PROFILE</h2>
      <div className='d-flex justify-content-end'><RiEdit2Fill /></div>

      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Student Id </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.id || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Student Name </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.full_name || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Batch </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.batch || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Department </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.department || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Course </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.course || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>DOB </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.dob || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Gender </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.gender || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Email </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.email || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row '>
        <div className='col-lg-3'>Phone </div>:
        <div className='col-lg-5 ms-2'>{stdProfile.phone || 'N/A'}</div>
      </div>
    </div>
  );
};

export default Profile;
