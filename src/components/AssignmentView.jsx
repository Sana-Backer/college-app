import React, { useEffect, useState } from 'react';
import './assign.css';
import { getAssignmentSubmissions, deleteSubmissionApi, StudentApi, getAssignmentApi, deleteAssignmentApi } from '../Services/allAPI';
import { FaEye, FaTrash, FaFilePdf } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const AssignmentView = () => {
    const [token, setToken] = useState(localStorage.getItem('access'));
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [students, setStudents] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem('access');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const response = await getAssignmentApi(token);
                console.log("Assignments API Response:", response); // Debugging
                if (Array.isArray(response?.data)) {
                    setAssignments(response.data);
                } else {
                    toast.info("No assignments found.");
                    setAssignments([]); // Ensure it's an empty array if data is not an array
                }
            } catch (error) {
                console.error("Error fetching assignments:", error);
                toast.error("Error fetching assignments.");
                setAssignments([]); // Default to an empty array in case of an error
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAssignments();
        }
    }, [token]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentApi(token);
                if (response?.data) {
                    const studentMap = response.data.reduce((acc, student) => {
                        acc[student.id] = student.full_name;
                        return acc;
                    }, {});
                    setStudents(studentMap);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                toast.error("Error fetching student data.");
            }
        };
        if (token) {
            fetchStudents();
        }
    }, [token]);

    const handleViewSubmissions = async (assignmentId) => {
        console.log("Assignment ID received:", assignmentId);  // Debug Log
    
        if (!assignmentId) {
            console.error("Error: assignmentId is undefined or null.");
            toast.error("Invalid assignment ID. Please try again.");
            return;
        }
    
        setSubmissions([]);
        setSelectedAssignment(assignmentId);
        setShowModal(true);
    
        try {
            const response = await getAssignmentSubmissions(token, assignmentId);
            if (response.status === 200 && Array.isArray(response.data)) {
                console.log("Submissions data:", response.data);
                setSubmissions(response.data);
            } else {
                toast.info("No submissions found for this assignment.");
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            toast.error("Error fetching submissions.");
        }
    };
    
    const handleDeleteAssignment = async (assignmentId) => {
        try {
            const response = await deleteAssignmentApi(token, assignmentId);
            
            if (response?.status === 204) {
                toast.success("Assignment deleted successfully.");
                setAssignments(assignments.filter((assignment) => assignment.id !== assignmentId));
            } else {
                toast.error("Failed to delete assignment. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
            toast.error(error.response?.data?.detail || "Error deleting assignment.");
        }
    };
    

    const handleDeleteSubmission = async (assignmentId, submissionId) => {
        if (window.confirm("Are you sure you want to delete this submission?")) {
            try {
                const response = await deleteSubmissionApi(token, assignmentId, submissionId);
                if (response.status === 204) {
                    toast.success("Submission deleted successfully.");
                    setSubmissions(submissions.filter((submission) => submission.id !== submissionId));
                }
            } catch (error) {
                console.error("Error deleting submission:", error);
                toast.error("Error deleting submission.");
            }
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Filter assignments based on search query
    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="assignment-view-container">
            <h1 className="Assignment-title"> Assignments </h1>

            <div className="search-assigment">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍Search by title..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="tablecontainer">
                {loading ? <p>Loading assignments...</p> : (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>SI No</th>
                                {/* <th>Subject</th> */}
                                <th>Topic</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssignments.length ? filteredAssignments.map((A, index) => (
                                <tr key={A.id}>
                                    <td>{index + 1}</td>
                                    {/* <td>{A.subject_name}</td> */}
                                    <td>{A.title}</td>
                                    <td>{A.deadline}</td>
                                    <td>
                                        <button
                                            className="action-btn view-btn"
                                            onClick={() => handleViewSubmissions(A.id)}
                                        >
                                            <FaEye className="icon" /> View Submissions
                                        </button>
                                    </td>
                                    <td>
                                        <button className='delete-btn' onClick={() => handleDeleteAssignment(A.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5">No assignments found.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
            <div className='modal-dialog modal-lg custom-modal'>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Submissions for Assignment ID: {selectedAssignment}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {submissions.length > 0 ? (
                            <table className="table-submitted">
                                <thead>
                                    <tr>
                                        <th>SI No</th>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Response</th>
                                        <th>Submitted At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((S, index) => (
                                        <tr key={S.id}>
                                            <td>{index + 1}</td>
                                            <td>{S.student || "N/A"}</td>
                                            <td>{S.student_name}</td>
                                            <td>
                                                {S.file ? (
                                                    <a
                                                        href={`http://localhost:8000${S.file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <FaFilePdf className="icon" /> {/* Display PDF icon */}
                                                    </a>
                                                ) : (
                                                    "No File"
                                                )}
                                            </td>
                                            <td>{S.submitted_at ? new Date(S.submitted_at).toLocaleString() : "N/A"}</td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteSubmission(selectedAssignment, S.id)}
                                                >
                                                    <FaTrash className="icon" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No submissions found for this assignment.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
            <ToastContainer />
        </div>
    );
};

export default AssignmentView;
