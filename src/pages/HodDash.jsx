import React, { useState } from 'react';
import Header from '../components/Header';
import './styles/stddash.css';
import prof3 from '../assets/proff3.jpg'
import { RiArrowGoForwardLine } from "react-icons/ri";
import AssignmentStd from '../components/AssignmentStd';
import ResultStd from '../components/ResultStd';
import HodProfile from '../components/hod/HodProfile';
import { useNavigate } from 'react-router-dom';
import ViewStudent from '../components/Admin/ViewStudent';
import ViewFaculty from '../components/Admin/ViewFaculty';
import { Button, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import AddNote from '../components/hod/AddNote';

const HodDash = () => {

    const [activeFeature, setActiveFeature] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null);

    const navigate = useNavigate()
    const backhome = () => {
        navigate('/home')
    }
    const handleActiveFeature = (feature) => {
        setActiveFeature(feature)
    }
    const renderFeature = () => {
        switch (activeFeature) {

            case "faculties":
                return < ViewFaculty />;
            case "students":
                return <ViewStudent />;
            case 'addnote':
                return <AddNote />



            default: case "profile":
                return <HodProfile />

        }
    }
    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowForm(null);
    };





    return (
        <section>

            <div>
                <div className='container d-flex justify-content-end mt-1 me-auto'>
                    <a href="" onClick={backhome} className='tohome'><RiArrowGoForwardLine /> Back to Home</a>
                </div>
                <div className='dash'>

                    <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2 '>
                        <a href="#profile" onClick={() => handleActiveFeature("profile")}>Profile</a>
                        <a href="#assignment" onClick={() => handleActiveFeature("faculties")}>Faculty List</a>
                        <a href="#notes" onClick={() => handleActiveFeature("students")}>Student List</a>
                        <a href="#attendence" onClick={() => handleActiveFeature("addnote")}>Notes</a>
                        <a href="#result" onClick={() => handleActiveFeature("result")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className='sidebar col-lg-2 container mb-2 '>
                        <div className='photo img-fluid'>
                            <img src={prof3} alt="" />
                        </div>
                        <div className='text-center'>
                            <h4>Aleena</h4>
                            <p>Department of civil Engineering</p>
                            <hr />
                            <p>email@gmail.com</p>
                            <p>908765432</p>

                        </div>
                    </div>
                    <div className="col-lg-8 view " id=''>
                        {renderFeature()}
                    </div>
                    <div className="col-lg-1"></div>

                </div>
                {/*  add student or faculty */}
                <div className="fab" onClick={handleAddUser}>
                    <FaPlus />
                </div>


            </div>
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{showForm ? Add `${showForm} `: "Select User Type"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showForm ? (
                        <div className="d-flex justify-content-around">
                            <Button variant="primary" onClick={() => setShowForm("Student")}>Add Student</Button>
                            <Button variant="success" onClick={() => setShowForm("Faculty")}>Add Faculty</Button>
                            <Button variant='warning' onClick={() => setShowForm("Department")}>Add Department</Button>
                        </div>
                    ) : showForm === "Student" ? (
                        <AddStudent onClose={handleModalClose} />
                    ) : showForm === "Faculty" ? (
                        <AddFaculty onClose={handleModalClose} />
                    ) : (
                        <AddDepartment onClose={handleModalClose} />
                    )}
                </Modal.Body>
            </Modal>

        </section>
    )
}

export default HodDash;
