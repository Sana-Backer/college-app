import React, { useEffect, useState } from 'react';
import './assign.css';
import { MdDelete } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";
import { FaEye, FaPen } from "react-icons/fa";
import { editAssignmentApi, FacultyApi, getAssignmentApi, getBatchApi, deleteAssignmentApi, createSubmissionApi } from '../Services/allAPI';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const AssignmentStd = () => {
  const [token, setToken] = useState(localStorage.getItem('access'));
  const [role, setRole] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [fileAdded, setFileAdded] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const getBatches = async () => {
      try {
        const response = await getBatchApi(token);
        if (response?.data) setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    getBatches();
  }, [token]);

  useEffect(() => {
    const allFaculties = async () => {
      try {
        const response = await FacultyApi(token);
        if (response?.data) setFaculties(response.data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    allFaculties();
  }, [token]);

  useEffect(() => {
    const allAssignments = async () => {
      try {
        const response = await getAssignmentApi(token);
        if (response?.data) setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    allAssignments();
  }, [token]);

  const handleUpload = (file, assignmentId) => {
    if (file) {
      setSubmissionFile(file);
      setFileAdded((prevFileAdded) => ({ ...prevFileAdded, [assignmentId]: true }));
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionFile) {
      toast.error("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", submissionFile);

    try {
      const response = await createSubmissionApi(token, assignmentId, formData);
      if (response.status === 201) {
        toast.success("Assignment submitted successfully!");
        setFileAdded((prevFileAdded) => ({ ...prevFileAdded, [assignmentId]: 'submitted' }));
        setSubmissionFile(null);
      } else {
        toast.error("Failed to submit assignment. Try again.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Error submitting assignment.");
    }
  };

  const handleShowModal = (title, description) => {
    setSelectedTitle(title);
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  return (
    <div className="assignment-container">
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((A, index) => (
              <tr key={A.id}>
                <td>{index + 1}</td>
                <td>{A.subject_name}</td>
                <td>{A.title}</td>
                <td>
                  <button onClick={() => handleShowModal(A.title, A.description)}>Check details</button>
                </td>
                <td>{A.deadline}</td>
                <td>
                  {role === 'student' ? (
                    <>
                      <button
                        className={`action-btn upload-btn ${fileAdded[A.id] ? 'added' : ''}`}
                        onClick={() => document.getElementById(`fileInput-${A.id}`).click()}
                      >
                        <IoIosCloudUpload className="icon" /> {fileAdded[A.id] ? (fileAdded[A.id] === 'submitted' ? 'Submitted' : 'Added') : 'Upload'}
                      </button>
                      <input
                        type="file"
                        id={`fileInput-${A.id}`}
                        style={{ display: 'none' }}
                        onChange={(e) => handleUpload(e.target.files[0], A.id)}
                      />
                      {fileAdded[A.id] && fileAdded[A.id] !== 'submitted' && (
                        <button className="action-btn submit-btn" onClick={() => handleSubmitAssignment(A.id)}>
                          Submit
                        </button>
                      )}
                    </>
                  ) : (
                    <button className="action-btn view-btn">
                      <FaEye className="icon" /> View Submissions
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing assignment */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Assignment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={selectedAssignment?.title || ""}
                disabled
              />
            </Form.Group>
            <Button variant="primary" disabled>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Description Modal */}
      <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assignment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="text-center">{selectedTitle}</h2>
          <p>{selectedDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDescriptionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <ToastContainer />
    </div>
  );
};

export default AssignmentStd;
