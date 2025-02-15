import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { upload_Studentnote, HodApi, FacultyApi, facultyApi, getCoursesApi, getSubjectApi } from '../../Services/allAPI';

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [subject,setSubject] = useState('')
  const [role, setRole] = useState('');
  const [selectedHod, setSelectedHod] = useState('');
  const [username, setUsername] = useState('');
    // fetched arrays
  const [hodList, setHodList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([])
  const [token, setToken] = useState(localStorage.getItem('access'));


  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    setRole(storedRole);
    setUsername(storedUsername);

    const fetchLists = async () => {
      try {
        const hodResponse = await HodApi();
        const facultyResponse = await facultyApi(token);
        setHodList(hodResponse.data);
        if (facultyResponse?.data && Array.isArray(facultyResponse.data)) {
          setFacultyList(facultyResponse.data);
        } else {
          setError('Unexpected response format for faculties');
          console.error('Unexpected response format:', facultyResponse);
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    const SubData = async () => {
      try {
        const response = await getSubjectApi(token, {});
        console.log(response.data); 
        setSubjects(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    SubData();
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi(token);
        console.log('Fetched response:', response); // Log full response
        if (response?.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setError('Unexpected response format');
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses. Please check your authorization token.');
      }
    };


    fetchCourses();
  }, [token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('course', course);
    if (role === 'HOD') {
      formData.append('hod', selectedHod);
    } else {
      formData.append('faculty', username); // Append the username

      console.log("Form Data:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const reqHeader = {
        Authorization: ` Bearer ${token}`,
      };

      try {
        const response = await upload_Studentnote(formData, reqHeader);
        if (response.status === 201) {
          toast.success("Note uploaded successfully!");
          onNoteAdded && onNoteAdded();
          setTitle('');
          setFile(null);
          setSubject('')
          setCourse('');
          setSelectedHod('');
        } else {
          console.error("Error response:", response.data);
          toast.error("There was a problem adding the note. Please try again.");
        }
      } catch (err) {
        console.error('Error uploading note:', err);
        console.log("Error response data:", err.response?.data); // Log the detailed error response
        toast.error("Error uploading note.");
      }
    };
  }

  return (
    <Container className="add-note-container">
      <h2>Upload Note</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>File</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="subject">
          <Form.Label>Select Subject</Form.Label>
          <Form.Control
            as="select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="course">
          <Form.Label>Select Course</Form.Label>
          <Form.Control
            as="select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>


        {/* Display the dropdown based on the role */}
        {role === 'HOD' ? (
          <Form.Group controlId="hod">
            <Form.Label>Select HOD</Form.Label>
            <Form.Control
              as="select"
              value={selectedHod}
              onChange={(e) => setSelectedHod(e.target.value)}
              required
            >
              <option value="">Select HOD</option>
              {hodList.map((hod) => (
                <option key={hod.id} value={hod.id}>
                  {hod.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        ) : (
          <Form.Group controlId="faculty">
            <Form.Label>Select Faculty</Form.Label>
            <Form.Control
              as="select"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            >
              <option value="">Select Faculty</option>
              {facultyList.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.full_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Button className='my-2' variant="primary" type="submit">Upload</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddNote;
