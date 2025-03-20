import React, { useState, useEffect } from 'react';
import { getCoursesApi, getDepartmentsApi, getSubjectApi } from '../../Services/allAPI';
import { Container, Table } from 'react-bootstrap';
import './viewsubject.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ViewSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [departments, setDepartments] = useState([])
    const [deptId, setDeptId] = useState('')

    const token = localStorage.getItem('access');


    useEffect(() => {
        const SubData = async () => {
            try {
                const response = await getSubjectApi(token, {});
                console.log(response.data);
                setSubjects(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        SubData();
    }, [token]);

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
        const fetchDept = async () => {
            try {
                const response = await getDepartmentsApi(token);
                if (response.status === 200) {
                    setDepartments(response.data);
                }
            } catch (error) {
                console.error('Error fetching departmnets:', error);
            }
        };

        fetchCourses()
        fetchDept()
    }, [])

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.course_name : "Unknown Course";
    };
    const getDeptName = (deptId) => {
        const department = departments.find(d => d.id === deptId);
        return department ? department.department_name : "Unknown dept";
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container className="mt-4">
            <h2>Subjects List</h2>
            <div className="tablecontainer">
                <Table striped bordered hover className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Course</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0 ? (
                            subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>{subject.name}</td>
                                    <td>{getDeptName(subject.department)}</td>
                                    <td>{getCourseName(subject.course)}</td>
                                    {/* <td className='course-actions'>
                                        <button className='editbtn' onClick={() => handleEdit()}>
                                            <FaEdit />
                                        </button>
                                        <button className="deletebtn" onClick={() => handleDelete()}>
                                            <FaTrashAlt />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No subjects found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default ViewSubject;
