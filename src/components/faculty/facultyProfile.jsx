import React, { useEffect, useState } from 'react';
import { getUserProfileApi, departmentApi } from '../../Services/allAPI';

const FacultyProfile = () => {
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("N/A"); // New state for department name

    useEffect(() => {
        // Fetch departments
        const fetchDepartments = async () => {
            try {
                const response = await departmentApi();
                setDepartments(response.data);
            } catch (error) {
                console.log("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        // Fetch faculty profile
        const fetchFacultyProfile = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                setError("Token or user ID not found in localStorage.");
                setLoading(false);
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token);
                const userData = response.data;
                console.log("Faculty Data:", userData);

                setFaculty({
                    id: userData.id,
                    full_name: userData.user?.full_name || "N/A",
                    dob: userData.user?.dob || "N/A",
                    gender: userData.user?.gender || "N/A",
                    departmentId: userData.department || null, // Store department ID
                    email: userData.user?.email || "N/A",
                    phone: userData.user?.phone || "N/A",
                    photo: userData.user?.photo || null,
                });

                // Find the department name if departments data is available
                if (userData.department) {
                    const foundDepartment = departments.find(dept => dept.id === userData.department);
                    setDepartmentName(foundDepartment ? foundDepartment.department_name : "N/A");
                }

            } catch (error) {
                console.error("Failed to fetch faculty details", error);
                setError("Failed to fetch faculty details.");
            } finally {
                setLoading(false);
            }
        };

        fetchFacultyProfile();
    }, [departments]); // Depend on departments to ensure department data is available

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile mt-2 border py-3 px-3">
            <h2 className="profile-title">PROFILE</h2>

            <div className="profile-details d-flex flex-row">
                <div className="col-lg-3 col-md-3 col-sm-3">Faculty Name </div>:
                <div className="col-lg-5 ms-2">{faculty.full_name}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row">
                <div className="col-lg-3 col-md-3 col-sm-3">Gender </div>:
                <div className="col-lg-5 ms-2">{faculty.gender}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row">
                <div className="col-lg-3 col-md-3 col-sm-3">DOB </div>:
                <div className="col-lg-5 ms-2">{faculty.dob}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row">
                <div className="col-lg-3 col-md-3 col-sm-3">Department </div>:
                <div className="col-lg-5 ms-2">{departmentName}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row">
                <div className="col-lg-3 col-md-3 col-sm-3">Email </div>:
                <div className="col-lg-5 ms-2">{faculty.email}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row">
                <div className="col-lg-3 col-md-3 col-sm-3">Phone </div>:
                <div className="col-lg-5 ms-2">{faculty.phone}</div>
            </div>
        </div>
    );
};

export default FacultyProfile;
