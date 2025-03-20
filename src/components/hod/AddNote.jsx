import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { upload_Studentnote, FacultyApi, getCoursesApi, getSubjectApi } from '../../Services/allAPI';

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState(''); // ✅ New state for semester
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const token = localStorage.getItem('access'); 
  const facultyId = localStorage.getItem("facultyId");

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || '');

    const fetchFacultyList = async () => {
      try {
        const facultyResponse = await FacultyApi();
        console.log(facultyResponse);

        if (facultyResponse.data.length > 0) {
          const currentUsername = localStorage.getItem('username');
          const matchedFaculty = facultyResponse.data.find(faculty => faculty.full_name === currentUsername);

          if (matchedFaculty) {
            const facultyId = matchedFaculty.id;
            localStorage.setItem('facultyId', facultyId);
            setUsername(matchedFaculty.username);
            setFacultyList(facultyResponse.data);
          } else {
            toast.error("Faculty not found for the current username.");
          }
        } else {
          toast.error("No faculty data available.");
        }
      } catch (error) {
        console.error('Error fetching faculty list:', error);
        toast.error("An error occurred while fetching faculty data.");
      }
    };
 
    const fetchSubjects = async () => {
      try {
        const response = await getSubjectApi(token);
        if (response.status === 200) {
          setSubjects(response.data);
        } else {
          toast.error("Failed to fetch subjects.");
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error("An error occurred while fetching subjects.");
      }
    };

    const fetchCourses = async () => {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      try {
        const response = await getCoursesApi(token);
        if (response.status === 200) {
          setCourses(response.data);
        } else {
          toast.error("Failed to fetch courses.");
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error("An error occurred while fetching courses.");
      }
    };

    fetchFacultyList();
    fetchCourses();
    fetchSubjects();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('course', course);
    formData.append('subject', subject);
    formData.append('semester', semester); 
    formData.append(role === 'HOD' ? 'hod' : 'faculty', facultyId);

    console.log("Form Data:");
    formData.forEach((value, key) => console.log(key, value));

    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }

    const reqHeader = { Authorization: `Bearer ${ token }` };

    try {
      const response = await upload_Studentnote(formData, reqHeader);
      if (response.status === 201) {
        toast.success("Note uploaded successfully!");
        onNoteAdded && onNoteAdded();
        setTitle('');
        setFile(null);
        setCourse('');
        setSubject('');
        setSemester('');
        document.getElementById('fileInput').value = "";
      } else {
        console.error("Error response:", response.data);
        toast.error("There was a problem adding the note. Please try again.");
      }
    } catch (err) {
      console.error('Error uploading note:', err);
      toast.error("Error uploading note.");
    }
  };

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
            id="fileInput"
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="subject">
          <Form.Label>Subjects</Form.Label>
          <Form.Control
            as="select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="course">
          <Form.Label>Course</Form.Label>
          <Form.Control
            as="select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.course_name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* ✅ New Semester Input Field */}
        <Form.Group controlId="semester">
          <Form.Label>Semester</Form.Label>
          <Form.Control
            as="select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>{`Semester ${sem}`}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="facultyId">
          <Form.Label>Faculty ID</Form.Label>
          <Form.Control type="text" value={localStorage.getItem('userId')} readOnly />
        </Form.Group>

        <Button className='my-2' variant="primary" type="submit">Upload</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddNote;
