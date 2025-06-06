import React, { useState, useEffect } from 'react';
import { getCoursesApi, getDepartmentsApi, getSubjectApi, editSubjectApi, deleteSubjectApi } from '../../Services/allAPI';
import { Container, Table, Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './viewsubject.css';

const ViewSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem('access');

    // Fetch subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await getSubjectApi(token, {});
                setSubjects(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [token]);

    // Fetch Courses & Departments
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCoursesApi(token);
                if (response.status === 200) {
                    setCourses(response.data);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await getDepartmentsApi(token);
                if (response.status === 200) {
                    setDepartments(response.data);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchCourses();
        fetchDepartments();
    }, [token]);

    // Get Course Name
    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.course_name : "Unknown Course";
    };

    // Get Department Name
    const getDeptName = (deptId) => {
        const department = departments.find(d => d.id === deptId);
        return department ? department.department_name : "Unknown Dept";
    };

    // Handle Edit Click
    const handleEdit = (subject) => {
        setSelectedSubject(subject);
        setNewSubjectName(subject.name);
        setShowModal(true);
    };

    // Handle Edit Save
    const handleEditSave = async () => {
        if (!selectedSubject || !newSubjectName.trim()) return;
    
        try {
            const updatedData = { 
                name: newSubjectName,
                course: selectedSubject.course,  // Include existing course ID
                department: selectedSubject.department // Include existing department ID
            };
    
            await editSubjectApi(selectedSubject.id, token, updatedData);
    
            // Update state after successful edit
            setSubjects(subjects.map(sub => 
                sub.id === selectedSubject.id ? { ...sub, name: newSubjectName } : sub
            ));
    
            setShowModal(false);
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };

    // Handle Delete Subject
    const handleDelete = async (subjectId) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;

        try {
            await deleteSubjectApi(subjectId, token);

            // Remove the deleted subject from the state
            setSubjects(subjects.filter(sub => sub.id !== subjectId));

        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container className="mt-4">
            <h2 className='title'>Subjects List</h2>
            <div className="tablecontainer">
                <Table striped bordered hover className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Course</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0 ? (
                            subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>{subject.name}</td>
                                    <td>{getDeptName(subject.department)}</td>
                                    <td>{getCourseName(subject.course)}</td>
                                    <td className='course-actions'>
                                        <button className='editbtn' onClick={() => handleEdit(subject)}>
                                            <FaEdit />
                                        </button>
                                        <button className="deletebtn" onClick={() => handleDelete(subject.id)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No subjects found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newSubjectName} 
                                onChange={(e) => setNewSubjectName(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ViewSubject;
