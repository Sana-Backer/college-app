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
                // Fetch HOD details
                // const hodResponse = await HodApi(token);
                // let hodId = null;

                // if (hodResponse.data) {
                //     hodId = hodResponse.data.id; 

                //     // localStorage.setItem('hodId', hodId); 
                //     setHodId(hodId); // Set HOD name in state
                // }

                // setHod(hodResponse?.data || []);

                // Fetch faculty list
                const facultyResponse = await facultyApi(token);
                console.log(facultyResponse);

                setFaculties(facultyResponse?.data || []);

                const initialAttendance = facultyResponse?.data.map((faculty, index) => ({
                    SI_No: index + 1,
                    facultyId: faculty.user,  // <-- This is where we store user ID
                    status: "present",
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
            attendance_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
            status: faculty.status, // ✅ Use selected status
        }));

        console.log("📌 Sending Attendance Data:", attendanceData); // Debugging Log

        try {
            const response = await createFacultyAttendanceApi(attendanceData, token);
            console.log("✅ Attendance submitted successfully:", response.data);
            toast.success('Attendance added successfullty')
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
                    <thead>
                        <tr>
                            <th>SI No.</th>
                            <th>Faculty ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((faculty, index) => (
                            <tr key={index}> {/* Avoid using faculty.user if it's undefined */}
                                <td>{index + 1}</td> {/* Dynamic Serial Number */}
                                <td>{faculty.facultyId}</td> {/* Corrected to use faculty.facultyId */}
                                <td>
                                    <select
                                        value={faculty.status}
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                    >
                                        <option classNam='present' value="present">Present</option>
                                        <option className="absent" value="absent">Absent</option>
                                        <option className="duty-leave" value="duty_leave">Duty Leave</option>
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
