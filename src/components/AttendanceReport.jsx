import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./attendancereport.css";
import { getAttendanceToStudentApi } from "../Services/allAPI";

const AttendanceReport = () => {
    const [stdAttendance, setStdAttendance] = useState([]);
    const token = localStorage.getItem("access");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchAttendanceReport = async () => {
            try {
                const response = await getAttendanceToStudentApi(userId, token);
                console.log("Attendance Data:", response); // ✅ Corrected Debugging Log

                // ✅ Fixed: Pass response directly (not response.data)
                const subjectAttendance = processAttendanceData(response);
                setStdAttendance(subjectAttendance);
            } catch (error) {
                console.log("Error fetching attendance:", error);
            }
        };

        fetchAttendanceReport();
    }, []);

    const processAttendanceData = (data) => {
        if (!Array.isArray(data)) {
            console.error("processAttendanceData received invalid data:", data);
            return [];
        }

        const subjectMap = {};

        data.forEach((record) => {
            if (!record.subject) return; // ✅ Skip records with null subject

            const subjectId = record.subject;

            if (!subjectMap[subjectId]) {
                subjectMap[subjectId] = {
                    subject: `Subject ${subjectId}`, // Placeholder, replace with actual subject names if needed
                    attended: 0,
                    total: 0,
                };
            }

            subjectMap[subjectId].total += 1;
            if (record.status === "present") {
                subjectMap[subjectId].attended += 1;
            }
        });

        return Object.values(subjectMap).map((subject) => ({
            ...subject,
            percentage: ((subject.attended / subject.total) * 100).toFixed(1),
        }));
    };

    return (
        <div className="attendance-report-container">
            <h2 className="attendance-title">Attendance Report</h2>
            <div className="attendance-list">
                {stdAttendance.length > 0 ? (
                    stdAttendance.map((subject, index) => (
                        <div key={index} className="attendance-card">
                            <div className="attendance-info">
                                <h6 className="subject-details">
                                    {subject.subject} - {subject.attended}/{subject.total}
                                </h6>
                            </div>
                            <div className="progress-circle">
                                <CircularProgressbar
                                    value={subject.percentage}
                                    text={`${subject.percentage}%`}
                                    styles={buildStyles({
                                        textSize: "24px",
                                        pathColor:
                                            subject.percentage >= 90
                                                ? "#4CAF50"
                                                : subject.percentage >= 75
                                                ? "#FFC107"
                                                : "#F44336",
                                        textColor: "#333",
                                        trailColor: "#eee",
                                    })}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No attendance records found.</p>
                )}
            </div>
        </div>
    );
};

export default AttendanceReport;
