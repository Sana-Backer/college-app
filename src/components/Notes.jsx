import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import pdf from '../assets/pdf2.webp'
import './note.css'
import 'react-toastify/dist/ReactToastify.css';
import { getNotes } from '../Services/allAPI';
import { MdDelete } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [role, setRole] = useState('')
  useEffect(() => {
    const fetchNotes = async () => {
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error('Authentication error: Missing token.');
        return;
      }


      try {
        const notesData = await getNotes(token);
        console.log('notesData:', notesData);

        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to fetch notes.');
      }
    };

    fetchNotes();
  }, []);

  return (
    // <div className="notes-container">
    //   <h2>Notes</h2>
    //   <ul>
    //     {notes.map(note => (
    //       <li key={note.id}>
    //         <h3>{note.title}</h3>
    //         <p>
    //               File:{" "}
    //               <a href={note.file} target="_blank" rel="noopener noreferrer">
    //                 View File
    //               </a>
    //             </p>
    //         <p>Course: {note.course}</p>
    //         <p>Faculty: {note.faculty}</p>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <div className='notes-container'>
      <div className="card-wrap p-2 gap-1">
        {notes.map(note => (
          <div className="note-card" key={note.id}>
            <div className='pdf'>
              <div><img src={pdf} style={{ width: '100px', height: '110px' }} alt="" /></div>
            </div>
            <div className='d-flex flex-column'>
              <h5>{note.title}</h5>
              <p>{note.subject}</p>
              <div className='buttons d-flex'>
                <a
                  href={note.file}
                  download={note.title} 
                  className="save-note px-3 py-2">Save</a> 

                 {role === 'hod' || role === 'faculty' ? (
                  <button
                    className='delete-note px-3 '
                    onClick={() => handleDelete(note.id)} 
                  >
                    <MdDelete className='w-100' />
                  </button>
                ) : (
                  <a href={note.file} target="_blank" rel="noopener noreferrer">
                    <button className='view-note px-3 py-2 '>
                      <FaRegEye className='w-100' />
                    </button>
                  </a>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Notes;
