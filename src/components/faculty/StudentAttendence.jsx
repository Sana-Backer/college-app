import React, { useState, useEffect } from "react";
import "./attendence.css";
import { createStudentAttendanceApi, getBatchApi, getSubjectApi, StudentApi } from "../../Services/allAPI";

const StdAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [batch, setBatch] = useState("");
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [students, setStudents] = useState([]);
    const [attendence, setAttendence] = useState([
      { attendenceId:'',
       studentId:'',
       studentName:'',
       Status:null}

    ])
    console.log('attendance',attendence);
    
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
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
                console.log(studentResponse);
                
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [token]);
    // filtering
    useEffect(() => {
        if (batch) {
            setFilteredStudents(students.filter(student => student.batch.toString() === batch));
        } else {
            setFilteredStudents(students);
        }
    }, [batch, students]);


    const handleStatusChange = (index, status) => {
        const updatedRecords = [...attendanceRecords];
        updatedRecords[index] = { ...updatedRecords[index], status };
        setAttendanceRecords(updatedRecords);
    };

    // Submit Attendance 
    const handleSubmitAttendance = async (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append("batch", selectedBatch);
        formData.append("subject", selectedSubject);
        formData.append("date", selectedDate);
        formData.append("attendance_id",setAttendence)
      
        console.log("Submitting Attendance Data:", Object.fromEntries(formData.entries()));
      
        try {
          const response = await createStudentAttendanceApi(token, formData);
          if (response.status === 201) {
            setSuccess("Attendance submitted successfully!");
          } else {
            setError("Failed to submit attendance.");
          }
        } catch (error) {
          console.error("Error submitting attendance:", error);
        }
      };
      

    return (
        <div className="attendance-container">
            <h2>Attendance Sheet</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Attendance submitted successfully!</p>}
            <div className="filters">
                <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map((b) => (
                        <option key={b.id} value={b.batch_name}>{b.batch_name}</option>
                    ))}
                </select>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                </select>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
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
                                <td value={attendence.id} >{index + 1}</td>
                                <td>{student.id}</td>
                                <td>{student.full_name}</td>
                                <td>
                                    <select
                                        value={student.status}
                                        onChange={(e) => handleStatusChange(student.studentId, e.target.value)}                                    >
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                    </select>
                                </td>

                            </tr>))
                    }

                </tbody>
            </table>

            <button
                className="submit-btn"
                onClick={handleSubmitAttendance}
            >
                {loading ? "Submitting..." : "Submit Attendance"}
            </button>
        </div>
    );
};

export default StdAttendance;
