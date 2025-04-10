import React, { useState, useEffect } from "react";
import axios from "axios";
import "./attendenceView.css";
import { getBatchApi } from "../../Services/allAPI";

const MonthlyAttendance = () => {
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState("");
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [attendanceData, setAttendanceData] = useState([]);
    const [batches, setBatches] = useState([]);
    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await getBatchApi()
                setBatches(response.data);
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };
        fetchBatches();
    }, [token]);


    const daysInMonth = new Date(month.split("-")[0], month.split("-")[1], 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="monthly-attendance-container">
            <h2>Monthly Attendance Record</h2>
            <div className="filters">
                <select value={batch} onChange={(e) => setBatch(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.batch_name}</option>
                    ))}
                </select>
                <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <table className="std-attendence-table">
                <thead className="">
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        {daysArray.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* {students.map((student) => ( */}
                        <tr >
                            <td>12</td>
                            <td>Sana Thasneem K A</td>
                            {daysArray.map((day) => (
                                <td key={day} className="attendance-status">
                                    {/* {attendanceData[student.id]?.[day] || "-"} */}
                                </td>
                            ))}
                        </tr>
                        
                </tbody>
            </table>
        </div>
    );
};

export default MonthlyAttendance;