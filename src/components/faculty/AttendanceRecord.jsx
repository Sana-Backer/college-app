import React, { useState, useEffect } from "react";
import "./attendanceRecord.css";
import { getBatchApi, getDepartmentsApi, getStudentAttendenceApi, getSubjectApi, StudentApi } from "../../Services/allAPI";
import {  FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const AttendanceRecord = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [deptRes, batchRes, subjectRes] = await Promise.all([
                    getDepartmentsApi(),
                    getBatchApi(),
                    getSubjectApi()
                ]);
                setDepartments(deptRes.data || []);
                setBatches(batchRes.data || []);
                setSubjects(subjectRes.data || []);
            } catch (error) {
                console.error("Error fetching filter data:", error);
                setError("Failed to load filters.");
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentApi(token);
                setStudents(response.data || []);
                console.log("Fetched students:", response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, [token]);

    // Fetch Attendance Records
    const fetchAttendanceRecords = async (event) => {
        event.preventDefault(); 
        setLoading(true);
        setError(null);

        try {
            const response = await getStudentAttendenceApi({
                department: selectedDepartment,
                batch: selectedBatch,
                subject: selectedSubject,
                date: selectedDate,
            });
            console.log("Filtered Attendance Records:", response.data);
            if (Array.isArray(response.data)) {
                setAttendanceRecords(response.data);
            } else {
                setAttendanceRecords([]);
                setError("Unexpected API response format.");
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            setError("Failed to load attendance records.");
            setAttendanceRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    return (

       
            <div className="attendance-record-container">
            <div className="mt-3" style={{fontSize:'18px',cursor:"pointer" }} onClick={() => navigate(-1)}>
            <FaArrowLeftLong style={{fontSize:'22px'}}/> Back to Attendance Marking
            </div>
                <h2 className="title">Student Attendance Records</h2>
    
                {error && <p className="error-message">{error}</p>}
    
                {/* Filters */}
                <div className="filters">
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                        ))}
                    </select>
    
                    <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>{batch.batch_name}</option>
                        ))}
                    </select>
    
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>
    
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
    
                    <button onClick={fetchAttendanceRecords} className="fetch-btn">Fetch Records</button>
                </div>
                    <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Department</th>
                            <th>Batch</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7">Loading...</td>
                            </tr>
                        ) : attendanceRecords.length > 0 ? (
                            attendanceRecords.map((record, index) => {
                                const student = students.find(std => std.user === record.student);
                                const studentName = student?.full_name || "N/A";
                                const departmentName = departments.find(dept => dept.id === record.department)?.department_name || "N/A";
                                const batchName = batches.find(batch => batch.id === record.batch)?.batch_name || "N/A";
                                const subjectName = subjects.find(subject => subject.id === record.subject)?.name || "N/A";
                                const formattedDate = record.created_at?.split("T")[0] || "N/A";
    
                                return (
                                    <tr key={record.id}>
                                        <td>{index + 1}</td>
                                        <td>{studentName}</td>
                                        <td>{departmentName}</td>
                                        <td>{batchName}</td>
                                        <td>{subjectName}</td>
                                        <td className={`status ${record.status}`}>{record.status}</td>
                                        <td>{formattedDate}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7">No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>        
            </div>
    );
};

export default AttendanceRecord;
