import React, { useState } from 'react'
import './addnote.css'
import pdf from '../../assets/pdf2.webp'
import { MdOutlineSimCardDownload } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';

const AddNote = () => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <div className='notes-container'>
      <div className='container'>
        <div className='d-flex justify-content-between'>
          <div><h4>Add your note here</h4></div>
          <button className='addnote  px-5 ' onClick={handleShow}>+</button>
        </div>

      </div>


      <div className="row d-flex p-2 gap-1">
        <div className="col-lg-3 note-card">
          <div className='pdf '>
            <div><img src={pdf} style={{ width: '100px', height: '110px' }} alt="" /></div>
          </div>
          <div className='d-flex flex-column'>
            <h5>DATA SCIENCE</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
            <div className='buttons d-flex ' >
              {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
              <button className='save-note px-3 py-2'>save</button>
              <button className='view-note px-3 '><FaRegEye className='w-100' /></button>
            </div>
          </div>

        </div>
        <div className="col-lg-3 note-card">
          <div className='pdf '>
            <div><img src={pdf} style={{ width: '100px', height: '110px' }} alt="" /></div>
          </div>
          <div className='d-flex flex-column'>
            <h5>DATA SCIENCE</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
            <div className='buttons d-flex ' >
              {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
              <button className='save-note px-3 py-2'>save</button>
              <button className='view-note px-3 '><FaRegEye className='w-100' /></button>
            </div>
          </div>

        </div>
        <div className="col-lg-3 note-card">
          <div className='pdf '>
            <div><img src={pdf} style={{ width: '100px', height: '110px' }} alt="" /></div>
          </div>
          <div className='d-flex flex-column'>
            <h5>DATA SCIENCE</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
            <div className='buttons d-flex ' >
              {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
              <button className='save-note px-3 py-2'>save</button>
              <button className='view-note px-3 '><FaRegEye className='w-100' /></button>
            </div>
          </div>

        </div>
        <div className="col-lg-3 note-card">
          <div className='pdf '>
            <div><img src={pdf} style={{ width: '100px', height: '110px' }} alt="" /></div>
          </div>
          <div className='d-flex flex-column'>
            <h5>DATA SCIENCE</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
            <div className='buttons d-flex ' >
              {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
              <button className='save-note px-3 py-2'>save</button>
              <button className='view-note px-3 '><FaRegEye className='w-100' /></button>
            </div>
          </div>

        </div>

      </div>
      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="custom-modal"
      >
        <div className='modal-container'>
          <div className='d-flex flex-column gap-3 p-3 w-100'>
            <h3 className='text-center'>Add Notes</h3>
            <input type="text" placeholder='Subject Name' className='form-control p-2 ' />
            <input type="text" placeholder='Title' className='form-control p-2' />
            <textarea placeholder='Description' className='form-control p-2' />
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default AddNote