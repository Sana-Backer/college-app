import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./attendancereport.css"; // Import the CSS file

const attendanceData = [
    { subject: "DISTRIBUTED COMPUTING", attended: 47, total: 52, percentage: 90.4 },
    { subject: "PROJECT PHASE II", attended: 116, total: 123, percentage: 94.3 },
    { subject: "EMBEDDED SYSTEMS", attended: 44, total: 52, percentage: 78.6 },
    { subject: "DATA MINING", attended: 43, total: 44, percentage: 45.7 },
    { subject: "BIOINFORMATICS", attended: 45, total: 49, percentage: 91.8 },
];

const AttendanceReport = () => {
    return (
        <div className="attendance-report-container">
            <h2 className="attendance-title">Attendance Report</h2>
            <div className="attendance-list">
                {attendanceData.map((subject, index) => (
                    <div key={index} className="attendance-card">
                        <div className="attendance-info">
                            {/* <h3 className="subject-code">{subject.code}</h3> */}
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
                                    pathColor: subject.percentage >= 90 ? "#4CAF50" : subject.percentage >= 75 ? "#FFC107" : "#F44336",
                                    textColor: "#333",
                                    trailColor: "#eee",
                                })}
                            />

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceReport;
