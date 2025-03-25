import React, { useEffect, useState } from 'react';
import './profile.css';
import { departmentApi, getBatchApi, getCoursesApi, getStudentApi } from '../Services/allAPI';

const Profile = () => {
  const [stdDetails, setStdDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("N/A"); 
  const [courses, setCourses] = useState([])
  const [courseName, setCoursesname] = useState('N/A')
  const [batches, setBatches ]= useState([])
  const [batchName, setBatchName] = useState('N/A')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, batchResponse, courseResponse] = await Promise.all([
          departmentApi(),
          getBatchApi(),
          getCoursesApi()
        ]);

        setDepartments(deptResponse.data);
        setBatches(batchResponse.data);
        setCourses(courseResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        let token = localStorage.getItem("token");
        let studentId = localStorage.getItem("studentId"); 
        let userRole = localStorage.getItem("role"); 
        const response = await getStudentApi(studentId, token, userRole === "student");
        const userData = response.data;
        
        setStdDetails({
          id: userData.student_id,
          full_name: userData.full_name || "N/A",
          dob: userData.dob || "N/A",
          gender: userData.gender || "N/A",
          departmentId: userData.department || null, 
          course: userData.course || null,
          batch: userData.batch || null,
          email: userData.email || "N/A",
          phone: userData.phone || "N/A",
          photo: userData.photo || null,

        });
        console.log("Student Profile:", response.data);
    
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Error fetching student profile."); 
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, []);
  useEffect(() => {
    if (stdDetails.departmentId && departments.length > 0) {
        const foundDepartment = departments.find(dept => dept.id === stdDetails.departmentId);
        setDepartmentName(foundDepartment ? foundDepartment.department_name : "N/A");
    }

    if (stdDetails.course && courses.length > 0) {
        const foundCourse = courses.find(c => c.id === stdDetails.course);
        setCoursesname(foundCourse ? foundCourse.course_name : "N/A");
    }

    if (stdDetails.batch && batches.length > 0) {
        const foundBatch = batches.find(b => b.id === stdDetails.batch);
        setBatchName(foundBatch ? foundBatch.batch_name : "N/A");
    }
}, [stdDetails, departments, courses, batches]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className="profile mt-2 border py-3 px-3">
      <h2 className='profile-title'>PROFILE</h2>

      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Student Id</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.id || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Student Name</div>:
        <div className='col-lg-5 ms-2'>{stdDetails.full_name || 'N/A'}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Batch</div>:
        <div className='col-lg-5 ms-2'>{batchName}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Department</div>:
        <div className='col-lg-5 ms-2'>{departmentName}</div>
      </div>
      <hr />
      <div className='profile-details d-flex flex-row'>
        <div className='col-lg-3'>Course</div>:
        <div className='col-lg-5 ms-2'>{courseName}</div>
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