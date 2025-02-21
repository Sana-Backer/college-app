import React, { useEffect, useState } from 'react';
import { getNotes } from '../Services/allAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './note.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [course, setCourse] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setUserRole(storedRole || '');

    const storedCourse = localStorage.getItem('course');
    setCourse(storedCourse || '');

    const fetchNotes = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error('Authentication error: Missing token.');
        return;
      }

      try {
        const notesData = await getNotes(token);
        console.log('Notes:', notesData);

        let filteredNotes = notesData;

        // If the user is a Student, filter notes by the stored course
        if (storedRole === 'Student') {
          filteredNotes = notesData.filter(note => note.course === storedCourse);
        }

        const notesWithDetails = filteredNotes.map(note => ({
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

    fetchNotes();
  }, []);

  return (
    <div className="notes-page">
      <h1 className="notes-title">Notes Management</h1>
      <div className="notes-grid-container">
        {notes.map(note => (
          <div className="note-card" key={note.id}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-info">Course: {note.courseName}</p>
            <p className="note-info">Faculty: {note.facultyName}</p>
            {note.fileUrl ? (
              <a className="note-link" href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                Open PDF
              </a>
            ) : (
              <p className="note-info">No PDF available</p>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Notes;
