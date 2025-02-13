import React, { useEffect, useState } from 'react';
import './assign.css';
import { MdDelete } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";
import { FaEye, FaPen } from "react-icons/fa";
import { editAssignmentApi, FacultyApi, getAssignmentApi, getBatchApi } from '../services/allApi';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const AssignmentStd = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileAdded, setFileAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batches, setBatches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const getBatches = async () => {
      try {
        const response = await getBatchApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setBatches(response.data);
        } else {
          setError('Unexpected response format');
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.log('Error fetching batches:', error);
        setError("Error fetching batches");
      }
    };
    getBatches();
  }, [token]);

  useEffect(() => {
    const allFaculties = async () => {
      try {
        const response = await FacultyApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setFaculties(response.data);
        } else {
          setError('Unexpected response format for faculties');
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast.error("An error occurred.");
      }
    };
    allFaculties();
  }, [token]);

  useEffect(() => {
    const allAssignments = async () => {
      try {
        const response = await getAssignmentApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        setError('Failed to fetch assignments. Please check your authorization token.');
      }
    };
    allAssignments();
  }, [token]);

  const handleUpload = (file) => {
    if (file) {
      setFileAdded(true);
    }
  };

  const handleEdit = (A) => {
    setSelectedAssignment(A);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAssignment((prevA) => ({
      ...prevA,
      [name]: name === "batch" || name === "faculty" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", selectedAssignment.title);
    formData.append("description", selectedAssignment.description);
    formData.append("faculty", selectedAssignment.faculty);
    formData.append("deadline", selectedAssignment.deadline);
    formData.append("batch", selectedAssignment.batch);

    console.log("Submitting assignment data:", Object.fromEntries(formData.entries()));

    try {
      const response = await editAssignmentApi(selectedAssignment.id, formData, token);
      if (response.status === 200) {
        toast.success("Assignment details updated successfully!");
        setShowModal(false);
        setAssignments(assignments.map(A => A.id === selectedAssignment.id ? selectedAssignment : A));
      } else {
        toast.error("Failed to update assignment details. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    console.log('Deleting:', id);
  };

  const handleViewSubmissions = () => {
    console.log('Viewing submissions');
  };

  return (
    <>
      <div className="assignment-container">
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>SI No</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Deadline</th>
                <th>Action</th>
                <th>Remove</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((A) => (
                <tr key={A.id}>
                  <td>{A.id}</td>
                  <td>OOPs</td>
                  <td>{A.title}</td>
                  <td>{A.deadline}</td>
                  <td>
                    {role === 'student' ? (
                      <>
                        <button
                          className={`action-btn upload-btn ${fileAdded ? 'added' : ''}`}
                          onClick={() => document.getElementById('fileInput').click()}
                        >
                          <IoIosCloudUpload className="icon" /> {fileAdded ? 'Added' : 'Upload'}
                        </button>
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: 'none' }}
                          onChange={(e) => handleUpload(e.target.files[0])}
                        />
                      </>
                    ) : (
                      <button className="action-btn view-btn" onClick={handleViewSubmissions}>
                        <FaEye className="icon" /> View Submissions
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(A.id)}>
                      <MdDelete className="icon" /> Delete
                    </button>
                  </td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(A)}>
                      <FaPen className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Assignment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedAssignment?.title || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </Form.Group>

              <Form.Group controlId="description" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={selectedAssignment?.description || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </Form.Group>

              {role === "hod" && (
                <>
                  <Form.Group controlId="batch" className="mt-3">
                    <Form.Label>Batch</Form.Label>
                    <Form.Control
                      as="select"
                      name="batch"
                      value={selectedAssignment?.batch || ""}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a Batch</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.batch_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="faculty" className="mt-3">
                    <Form.Label>Faculty</Form.Label>
                    <Form.Control
                      as="select"
                      name="faculty"
                      value={selectedAssignment?.faculty || ""}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a Faculty</option>
                      {faculties.map((fac) => (
                        <option key={fac.id} value={fac.id}>
                          {fac.full_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </>
              )}



              <Form.Group controlId="deadline" className="mt-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="deadline"
                  value={selectedAssignment?.deadline || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4" disabled={isSubmitting}>
                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
};

export default AssignmentStd;
