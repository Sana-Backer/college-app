import React, { useEffect, useState } from 'react';
import './profile.css';
import { getStudentApi } from '../Services/allAPI';

const Profile = () => {
  const [stdDetails, setStdDetails] = useState({}); // Initialize as an object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        let token = localStorage.getItem("token");
        let studentId = localStorage.getItem("studentId"); // Store this after login
        let userRole = localStorage.getItem("role"); // Store this after login

        const response = await getStudentApi(studentId, token, userRole === "student");
        setStdDetails(response.data); // Set the fetched data
        console.log("✅ Student Profile:", response.data);
      } catch (error) {
        console.error("❌ Error fetching student profile:", error);
        setError("Error fetching student profile."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchStudentProfile();
  }, []);

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
        <div className='col-lg-3'>Student Id</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.student_id || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Student Name</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.full_name || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Batch</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.batch || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Department</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.department || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Course</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.course || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>DOB</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.dob || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Gender</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.gender || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Email</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.email || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Phone</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.phone || 'N/A'}</div>
      </div>
    </div>
  );
};

export default Profile;