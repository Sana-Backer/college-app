import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AtendenceRecord.css";
import { getFacultyAttendanceRecords, deleteFacultyAttendenceApi } from "../../Services/allAPI"; // Import delete function

const FacAttendanceView = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); 
    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchAttendanceRecords();
    }, [token]);

    const fetchAttendanceRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getFacultyAttendanceRecords(token);
            console.log("Fetched Attendance:", response);

            setAttendanceRecords(response);
            setFilteredRecords(response);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            setError("Failed to load attendance records.");
        } finally {
            setLoading(false);
        }
    };

    // Handle date filtering
    const handleDateChange = (event) => {
        const selected = event.target.value;
        setSelectedDate(selected);

        if (selected) {
            const filtered = attendanceRecords.filter(record => record.attendance_date === selected);
            setFilteredRecords(filtered);
        } else {
            setFilteredRecords(attendanceRecords);
        }
    };

    // Handle Delete
    // const handleDelete = async (id) => {
    //     if (!window.confirm("Are you sure you want to delete this record?")) return;

    //     try {
    //         await deleteFacultyAttendenceApi(id, token);
    //         setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
    //         setFilteredRecords(filteredRecords.filter(record => record.id !== id));
    //     } catch (error) {
    //         console.error("Error deleting record:", error);
    //         alert("Failed to delete record. Please try again.");
    //     }
    // };

    return (
        <div className="attendance-view-container">
            <div className="Attendance-Rec-container">
                <h2 className="Attendance-Rec-title">Faculty Attendance Records</h2>
            </div>

            <div className="header-container">
                <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>

                <div className="date-filter">
                    <label>Filter by Date: </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-message">Loading...</p>}

            <table>
                <thead className="fac-attendence-view">
                    <tr>
                        <th>SI No.</th>
                        <th>Faculty ID</th>
                        <th>Attendance Date</th>
                        <th>Status</th>
                        <th>Action</th> {/* New Column for Delete Button */}
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record, index) => (
                            <tr key={record.id}>
                                <td>{index + 1}</td>
                                <td>{record.faculty_id || "N/A"}</td>
                                <td>{record.attendance_date}</td>
                                <td
                                    style={{
                                        color: record.status === "present" ? "darkGreen" :
                                            record.status === "absent" ? "red" :
                                                record.status === "duty_leave" ? "orange" : "black",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {record.status}
                                </td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(record.id)}>🗑 Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
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
