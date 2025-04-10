import React, { useState, useEffect } from 'react';
import './viewstd.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Container, Row, Col, Spinner, Table } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify";
import { deleteStudentApi, departmentApi, editStdApi, getBatchApi, getCoursesApi, StudentApi } from '../../Services/allAPI';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ViewStudent = () => {
  const serverUrl = 'http://localhost:8000';
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterBatch, setFilterBatch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  console.log('stddep', departments);
  console.log('filtstd', filteredStudents);


  const [selectedStudent, setSelectedStudent] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    course: '',
    batch: '',
    gender: '',
    photo: null,
    student_id:''
  });

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error("Unauthorized: No token found");
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const studentResponse = await StudentApi(token);
        if (Array.isArray(studentResponse.data)) {
          setStudents(studentResponse.data);
          setFilteredStudents(studentResponse.data);
          console.log(studentResponse);
          
        }

        const deptResponse = await departmentApi(token);
        setDepartments(Array.isArray(deptResponse.data) ? deptResponse.data : []);

        const courseResponse = await getCoursesApi(token);
        setCourses(Array.isArray(courseResponse.data) ? courseResponse.data : []);

        const batchResponse = await getBatchApi(token);
        console.log("Batch Response:", batchResponse.data); 

        if (Array.isArray(batchResponse.data)) {
          setBatches(batchResponse.data);
        } else {
          setBatches([]); 
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      }
    };



    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!students || students.length === 0) return;

    let filtered = students;

    if (filterBatch) {
      filtered = filtered.filter(student => student.batch.toString() === filterBatch);
    }
    if (filterDepartment) {
      filtered = filtered.filter(student => student.department.toString() === filterDepartment);
    }
    if (filterCourse) {
      filtered = filtered.filter(student => student.course.toString() === filterCourse);
    }

    console.log("Filtered Students:", filtered);
    setFilteredStudents(filtered);
  }, [filterBatch, filterDepartment, filterCourse, students]);


  const handleEdit = (student) => {
    setSelectedStudent({
      ...student,
      user: student.user || student.id
    });
    setShowModal(true);
  };
  
  const handleDelete = async (student_id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await deleteStudentApi(student_id, localStorage.getItem('access'));
              console.log("studentid",student_id);

      if (response.status === 204) {
        setStudents(students.filter(student => student.id !== student_id));
        
        toast.success("Student deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error("Failed to delete student.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    Object.keys(selectedStudent).forEach((key) => {
      if (selectedStudent[key] && key !== 'photo') {
        formData.append(key, selectedStudent[key]);
      }
    });
  
    if (selectedStudent.photo instanceof File) {
      formData.append("photo", selectedStudent.photo);
    }
  
    try {
      console.log("Submitting Student ID:", selectedStudent.student_id); 
      const response = await editStdApi(selectedStudent.user, formData, localStorage.getItem('access'));
      
      if (response.status === 200) {
        setStudents(students.map(student =>
          student.user === selectedStudent.user ? { ...response.data } : student
        ));
        setShowModal(false);
        toast.success("Student details updated!");
      } else {
        toast.error("Failed to update student details.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Container>
      <ToastContainer />
      <h2 className='title'>Student List</h2>

      <Row className="filter-container ">
        <Col md={4}>
          <Form.Select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}>
            <option value="">Filter by Batch</option>
            {Array.isArray(batches) && batches.length > 0 ? (
              batches.map((batch) => (
                <option key={batch.id} value={batch.id}>{batch.batch_name}</option>
              ))
            ) : (
              <option disabled>No batches available</option>
            )}
          </Form.Select>

        </Col>
        <Col md={4}>
          <Form.Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="">Filter by Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="">Filter by Course</option>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.id} value={course.id}>{course.course_name}</option>
              ))
            ) : (
              <option disabled>No courses available</option>
            )}
          </Form.Select>

        </Col>
      </Row>

      <div className='tablecontainer'>

        <Table striped bordered hover responsive className="student-table bg-white">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{departments.find(dept => dept.id === student.department)?.department_name || 'Unknown'}</td>
                <td>{courses.find(course => course.id === student.course)?.course_name || 'Unknown'}</td>
                <td>{batches.find(batch => batch.id === student.batch)?.batch_name || 'Unknown'}</td>
                <td>
                  {student.photo ? (
                    <img src={`${serverUrl}${student.photo}`} alt={student.full_name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                  ) : "No Photo"}
                </td>
                <td>
                  <button className='editbtn' onClick={() => handleEdit(student)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(student.student_id)} className="deletebtn">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      </div>



      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <Form>
              {/* Full Name */}
              <Form.Group controlId="full_name" className="mt-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStudent.full_name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, full_name: e.target.value })}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group controlId="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                />
              </Form.Group>
           

              {/* Phone */}
              <Form.Group controlId="phone" className="mt-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStudent.phone}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                />
              </Form.Group>

              {/* Department Dropdown */}
              <Form.Group controlId="department" className="mt-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  value={selectedStudent.department}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Course Dropdown */}
              <Form.Group controlId="course" className="mt-3">
                <Form.Label>Course</Form.Label>
                <Form.Select
                  value={selectedStudent.course}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, course: e.target.value })}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.course_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Batch Dropdown */}
              <Form.Group controlId="batch" className="mt-3">
                <Form.Label>Batch</Form.Label>
                <Form.Select
                  value={selectedStudent.batch}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, batch: e.target.value })}
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.batch_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Gender Dropdown */}
              <Form.Group controlId="gender" className="mt-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={selectedStudent.gender}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              {/* Photo Upload */}
              <Form.Group controlId="photo" className="mt-3">
                <Form.Label>Upload Photo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, photo: e.target.files[0] })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>



    </Container>
  );
};

export default ViewStudent;
