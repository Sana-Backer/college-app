import React, { useState, useEffect } from "react";
import axios from "axios";
import "./attendenceView.css";
import { getBatchApi, getSubjectApi, StudentApi } from "../../Services/allAPI";

const AttendanceView = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState("");
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("present");
    const [filteredStudents, setFilteredStudents] = useState([]);


    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [batchResponse, subjectResponse, studentResponse] = await Promise.all([
                    getBatchApi(token),
                    getSubjectApi(token),
                    StudentApi(token)
                ]);

                setBatches(batchResponse?.data || []);
                setSubjects(subjectResponse?.data || []);
                setStudents(studentResponse?.data || [])
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        if (batch) {
            setFilteredStudents(students.filter(student => student.batch.toString() === batch));
        } else {
            setFilteredStudents(students);
        }
    }, [batch, students]);

    // Fetch attendancerecords
    const fetchAttendance = async () => {
        setLoading(true);
        setError(null);

        if (!batch || !subject || !date) {
            setError("Batch, subject, and date are required.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/student-attendance-reports/", {
                params: { batch, subject, date },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                setStudents(response.data);
            } else {
                setStudents([]);
                setError("Unexpected response format.");
            }
        } catch (err) {
            console.error("Error fetching attendance:", err);
            setError("Failed to fetch attendance records.");
        } finally {
            setLoading(false);
        }
    };

    // Handle adding a student to attendance
    // const handleAddStudent = async () => {
    //     if (!selectedStudent || !attendanceStatus) {
    //         alert("Please select a student and status.");
    //         return;
    //     }

    //     try {
    //         const response = await axios.post("http://127.0.0.1:8000/api/student-attendance-reports/", {
    //             batch,
    //             subject,
    //             date,
    //             student_id: selectedStudent,
    //             status: attendanceStatus,
    //         }, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         setAttendanceRecords([...attendanceRecords, response.data]); // Update table
    //         setIsModalOpen(false); // Close modal
    //     } catch (error) {
    //         console.error("Error adding student:", error);
    //         setError("Failed to add student.");
    //     }
    // };

    return (
        <div className="attendance-view-container">
            <h2>View Attendance Records</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="filters">
                <select value={batch} onChange={(e) => setBatch(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.batch_name}</option>
                    ))}
                </select>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            </div>

            <table>
                <thead>
                    <tr>
                        <th>Attendance ID</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index+1}</td>
                                <td>{student.id}</td>
                                <td>{student.full_name}</td>
                            </tr>))
}
            

                </tbody>
            </table>

            {/* MODAL FOR ADDING STUDENT */}
            {/* {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add Student to Attendance</h3>
                        <select value={student} onChange={(e) => setstudent(e.target.value)}>
                            <option value="">Select Student</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>{s.full_name}</option>
                            ))}
                        </select>
                    
                        
                        <div className="modal-buttons">
                            <button onClick={handleAddStudent}>Add</button>
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default AttendanceView;
