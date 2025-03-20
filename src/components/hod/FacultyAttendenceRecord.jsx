import React, { useState, useEffect } from "react";
import "./AtendenceRecord.css";
import { getFacultyAttendanceRecords } from "../../Services/allAPI";

const FacAttendanceView = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                setLoading(true);
                setError(null);

                // ✅ Pass token when calling API
                const response = await getFacultyAttendanceRecords(token);

                console.log("Fetched Attendance:", response); // Debugging log
                setAttendanceRecords(response);
            } catch (error) {
                console.error("Error fetching attendance records:", error);
                setError("Failed to load attendance records.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAttendanceRecords();
        } else {
            setError("Unauthorized: Please log in.");
        }
    }, [token]);

    return (
        <div className="attendance-view-container">
            <h2>Faculty Attendance Records</h2>

            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-message">Loading...</p>}

            <table>
                <thead>
                    <tr>
                        <th>SI No.</th>
                        <th>Faculty id</th>
                        <th>Attendance Date</th>
                        <th>Status</th>
                      
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record, index) => (
                            <tr key={record.id}>
                                <td>{index + 1}</td> {/* Serial Number */}
                                <td>{record.faculty_id || "N/A"}</td>
                                <td>{record.attendance_date}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No attendance records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FacAttendanceView;
