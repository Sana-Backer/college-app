import React, { useState, useEffect } from "react";
import "./FacAttendence.css";
import { createFacultyAttendanceApi, facultyApi, HodApi } from "../../Services/allAPI";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FacAttendence = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [recordedBy, setRecordedBy] = useState("");
    const [faculties, setFaculties] = useState('');
    const [hod, setHod] = useState([])
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [hodId, setHodId] = useState('');

    const token = localStorage.getItem('access');
    const username = localStorage.getItem('username')
    const navigate = useNavigate()

    // Fetch faculty list
    useEffect(() => {
        const fetchData = async () => {
            try {
               
                // Fetch faculty list
                const facultyResponse = await facultyApi(token);
                console.log(facultyResponse);

                setFaculties(facultyResponse?.data || []);

                const initialAttendance = facultyResponse?.data.map((faculty, index) => ({
                    SI_No: index + 1,
                    facultyId: faculty.user,  // <-- This is where we store user ID
                    status: "present",
                    name : faculty.full_name,
                    recordedBy: hodId
                }));


                setAttendance(initialAttendance);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [token]);


    // Handle status change
    const handleStatusChange = (index, status) => {
        const updatedAttendance = [...attendance];
        updatedAttendance[index].status = status;
        setAttendance(updatedAttendance);
    };
    useEffect(() => {
        const userData = (localStorage.getItem("username"));



        if (userData) {
            setRecordedBy(userData.name);
        }
    }, []);

    // Submit Attendance
    const handleSubmitAttendance = async () => {
        const token = localStorage.getItem('access');

        if (!token || attendance.length === 0) {
            console.error("Token not found or no attendance data.");
            return;
        }

        const attendanceData = attendance.map(faculty => ({
            faculty_id: faculty.facultyId,  // ✅ Use actual faculty IDs
            name : faculty.full_name,
            attendance_date: new Date().toISOString().split("T")[0],
            status: faculty.status, 
        }));

        console.log("📌 Sending Attendance Data:", attendanceData);

        try {
            const response = await createFacultyAttendanceApi(attendanceData, token);
            console.log("✅ Attendance submitted successfully:", response.data);
            alert('Attendance added successfullty')
        } catch (error) {
            console.error("❌ Error submitting attendance:", error.response?.data || error);
            toast.error('error submitting attendance')
        }
    };





    return (
        <div className="attendance-container">
            <div>
                <h2>Faculty Attendance Sheet</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="filters">

                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

                    <label>
                        Recorded By:
                        <input type="text" value={username} readOnly />
                    </label>
                </div>

                <table>
                    <thead className="fac-detail">
                        <tr>
                            <th>SI No.</th>
                            <th>Faculty ID</th>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((faculty, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{faculty.facultyId}</td>
                                <td>{faculty.name}</td>
                                <td>
                                    <select
                                        value={faculty.status}
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                        style={{ color: faculty.status === "present" ? "darkGreen" : faculty.status === "absent" ? "red" : "orange" }}
                                    >
                                        <option value="present" style={{ color: "green" }}>Present</option>
                                        <option value="absent" style={{ color: "red" }}>Absent</option>
                                        <option value="duty_leave" style={{ color: "orange" }}>Duty Leave</option>
                                    </select>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>



                <button className="submit-btn" onClick={handleSubmitAttendance} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Attendance"}
                </button>
                <div className="mt-5 "><button className="btn p-2" onClick={() => navigate("/faculty-attendance-record")}>view faculty attendence record</button></div>

            </div>
        </div>


    );
};

export default FacAttendence;
