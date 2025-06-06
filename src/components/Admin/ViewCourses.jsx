import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Modal, Button, Form } from 'react-bootstrap';
import { deleteCourseApi,  editCourseApi, getCoursesApi, } from '../../Services/allAPI';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './viewcourse.css';
import { toast } from 'react-toastify';

const ViewCourse = () => {
    const [courses, setCourses] = useState([]);
    const [token] = useState(localStorage.getItem('token'));
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({ id: '', course_name: '', description: '' });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCoursesApi(token);
                if (response?.data && Array.isArray(response.data)) {
                    setCourses(response.data);
                } else {
                    setError('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to fetch courses. Please check your authorization token.');
            }
        };
        fetchCourses();
    }, [token]);

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedCourse({ id: '', course_name: '', description: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedCourse({ ...selectedCourse, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const response = await editCourseApi(selectedCourse.id, token, selectedCourse);  
            if (response.status === 200) {
                setCourses(courses.map(course => (course.id === selectedCourse.id ? response.data : course)));
                toast.success("Course updated successfully.");
                handleClose();
            } else {
                toast.error("Failed to update course.");
            }
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error("An error occurred while updating.");
        }
    };
    

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course? ")) {
            return;
        }
        try {
            const response = await deleteCourseApi(id, token)
            if (response.status === 204) {
                setCourses(courses.filter((course) => course.id !== id))
                toast.success("course deleted successfully.");
            } else {
                toast.error("Failed to delete course.");
            }
        } catch (error) {
            console.log("error deleting course", error);
            toast.error("An error occurred while deleting.");
        }
    }

    return (
        <Container className="mt-4">
            <h2 className='title'>Courses List</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className='tablecontainer'>
                <Table striped bordered hover className='course-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.id}</td>
                                <td>{course.course_name}</td>
                               <td style={{ wordWrap: "break-word", whiteSpace: "normal", maxHeight:'200px' }}>
                                    {course.description}</td>
                                <td className='course-actions'>
                                    <button className='editbtn' onClick={() => handleEdit(course)}>
                                        <FaEdit />
                                    </button>
                                    <button className="deletebtn" onClick={()=> handleDelete(course.id)}>
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Edit Course Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="course_name"
                                value={selectedCourse.course_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={selectedCourse.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ViewCourse;
