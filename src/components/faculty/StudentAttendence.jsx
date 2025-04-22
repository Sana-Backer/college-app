import React, { useState, useEffect } from "react";
import "./attendence.css";
import { 
    createStudentAttendanceApi, 
    getBatchApi, 
    getSubjectApi, 
    StudentApi,
    getDepartmentsApi
} from "../../Services/allAPI";
import { useNavigate } from "react-router-dom";

const StdAttendance = () => {
    const [departments, setDepartments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const token = localStorage.getItem("access");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptResponse, batchResponse, subjectResponse, studentResponse] = await Promise.all([
                    getDepartmentsApi(token),
                    getBatchApi(token),
                    getSubjectApi(token),
                    StudentApi(token)
                ]);

                setDepartments(deptResponse?.data || []);
                setBatches(batchResponse?.data || []);
                setSubjects(subjectResponse?.data || []);
                setStudents(studentResponse?.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        if (selectedBatch) {
            const filtered = students.filter(student => student.batch && String(student.batch) === String(selectedBatch));
            setFilteredStudents(filtered);

            setAttendanceRecords(filtered.map(student => ({
                student_id: student.student_id || null,  
                status: "present" 
            })));
        } else {
            setFilteredStudents([]);
            setAttendanceRecords([]);
        }
    }, [selectedBatch, students]);

    const handleStatusChange = (index, status) => {
        setAttendanceRecords(prevRecords => {
            const updatedRecords = [...prevRecords];
            updatedRecords[index] = { ...updatedRecords[index], status };
            return updatedRecords;
        });
    };

    // Submit attendance
    const handleSubmitAttendance = async () => {
        if (!selectedDepartment || !selectedBatch || !selectedSubject || !selectedDate) {
            setError("Please select department, batch, subject, and date.");
            return;
        }
        if (filteredStudents.length === 0) {
            setError("No students available for attendance.");
            return;
        }
    
        const attendanceData = attendanceRecords.map((record, index) => ({
            student_id: filteredStudents[index].user,
            batch: selectedBatch,
            subject: selectedSubject,
            department: selectedDepartment,
            date: selectedDate,
            status: record.status
        }));
        
    
        console.log("📌 Submitting Attendance Data:", attendanceData);
    
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            const response = await createStudentAttendanceApi(attendanceData, token);
            if (response.status === 201) {
                setSuccess("Attendance submitted successfully!");
                setAttendanceRecords([]);
            } else {
                setError(response.data?.error || "Failed to submit attendance.");
            }
        } catch (error) {
            console.error("❌ Error submitting attendance:", error);
            setError(error.response?.data?.error || "Failed to submit attendance.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="student-attendance-container">
            <h2 className="attendence-title"> Attendance Sheet</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

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
                    {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.batch_name}</option>
                    ))}
                </select>

                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>

                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            {/* Attendance Table */}
            <table className="std-attendence-table">
                <thead>
                    <tr className="table-header">
                        <th>#</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <tr key={student.student_id}>  {/* ✅ Use student.id instead of student.student_id */}
                                <td>{index + 1}</td>
                                <td>{student.student_id}</td>  {/* ✅ Use student.id */}
                                <td>{student.full_name}</td>
                                <td>
                                    <select
                                        value={attendanceRecords[index]?.status || ""}
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                    >
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                        <option value="duty_leave">Duty Leave</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No students found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Submit Button */}
            <button className="submit-btn" onClick={handleSubmitAttendance} disabled={loading}>
                {loading ? "Submitting..." : "Submit Attendance"}
            </button>

            {/* View Faculty Attendance Record */}
            <div className="mt-5">
                <button className="btn p-2" onClick={() => navigate("/student-attendance")}>
                    View Student Attendance Record
                </button>
            </div>
        </div>
    );
};

export default StdAttendance;
