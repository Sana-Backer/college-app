import React, { useState } from 'react';
import './addnote.css';
import pdf from '../../assets/pdf2.webp';
import { FaRegEye } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';

const AddNote = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='notes-container p-4'>
      <div className='container text-center'>
        <button className='btn btn-primary px-4 py-2 rounded shadow' onClick={handleShow}>Add Note</button>
      </div>

      <div className='row d-flex justify-content-center mt-4'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='col-12 col-sm-6 col-md-4 col-lg-3 note-card shadow p-3 rounded text-center mb-3'>
            <img src={pdf} style={{ width: '80px', height: '100px' }} alt='PDF Preview' className='mb-2 img-fluid' />
            <h5 className='fw-bold'>DATA SCIENCE</h5>
            <p className='text-muted small'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <div className='d-flex justify-content-around'>
              <button className='btn btn-success btn-sm rounded-pill'>Save</button>
              <button className='btn btn-outline-primary btn-sm rounded-pill'><FaRegEye /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <div className='p-4'>
          <h3 className='text-center mb-3'>Add Notes</h3>
          <input type='text' placeholder='Subject Name' className='form-control mb-2' />
          <input type='text' placeholder='Title' className='form-control mb-2' />
          <textarea placeholder='Description' className='form-control mb-2' rows='3' />
        </div>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>Close</Button>
          <Button variant='primary'>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNote;
