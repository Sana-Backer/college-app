import React, { useEffect, useState } from 'react';
import { deleteNoteApi, FacultyApi, getCoursesApi, getNotes, getSubjectApi } from '../Services/allAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './note.css';  // Add styles in this file
import { FaTrash } from 'react-icons/fa';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

  const [course, setCourse] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedCourse = localStorage.getItem('course');
    const token = localStorage.getItem('access');

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedCourse) {
      setCourse(storedCourse);
    }

    const fetchNotes = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error('Authentication error: Missing token.');
        return;
      }

      try {
        // Fetch all notes regardless of the user's role
        const notesData = await getNotes(token);

        console.log('Notes:', notesData);

        const notesWithDetails = notesData.map(note => ({
          ...note,
          facultyName: note.faculty_name || 'Unknown',
          courseName: note.course_name || 'Unknown',
          fileUrl: note.file ? `http://localhost:8000${note.file}` : null
        }));

        setNotes(notesWithDetails);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to fetch notes.');
      }
    };
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

    // const fetchSubjects = async () => {
    //   try {
    //     const response = await getSubjectApi(token);
    //     if (response.status === 200) {
    //       setSubjects(response.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching subjects:', error);
    //   }
    // };

    const fetchFacultyList = async () => {
      try {
        const response = await FacultyApi();
        if (response.status === 200) {
          setFacultyList(response.data);
        }
      } catch (error) {
        console.error('Error fetching faculty list:', error);
      }
    };



    fetchNotes();
    fetchCourses();
    // fetchSubjects();
    fetchFacultyList();
  }, [course, userRole]);


  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.course_name : "Unknown Course";
  };

  const getFacultyName = (facultyId) => {
    const faculty = facultyList.find(f => f.id === facultyId);
    return faculty ? faculty.full_name : "Unknown Faculty";
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('Authentication error: Missing token.');
      return;
    }

    try {
      const response = await deleteNoteApi(noteId, token);
      if (response.status === 204) {
        toast.success("Note deleted successfully!");
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } else {
        toast.error("Failed to delete note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error.response?.data || error.message);
      toast.error("Error deleting note.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
};
const filteredNotes= notes.filter((note) =>
  note.title.toLowerCase().includes(searchQuery)
);


  return (
    <div className="notes-page">
      <h1 className="notes-title"> Notes </h1>
      <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
      <div className="notes-grid-container">
     
        {filteredNotes.map(note => (
          <div className="note-card" key={note.id}>
            <h3 className="note-title">{note.title}</h3>
            {/* <p className="note-info">Subject: {note.subject}</p> */}
            <p className="note-info">Course: {getCourseName(note.course)}</p>
            <p className="note-info">Faculty: {getFacultyName(note.faculty)}</p>
            {note.fileUrl ? (
              <a className="note-link" href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                Open PDF
              </a>
            ) : (
              <p className="note-info">No PDF available</p>
            )}
            <button className="note-delete-btn" onClick={() => handleDeleteNote(note.id)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Notes;
