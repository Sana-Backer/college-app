import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner, Modal, Form, Card } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import { deleteFacultyApi, departmentApi, editFacultyApi, FacultyApi } from "../../Services/allAPI";
import './viewfaculty.css'

function ViewFaculty() {

  const serverUrl = 'http://localhost:8000';

  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredFaculty, setFilteredFaculty] = useState([]); 
  const [departments, setDepartments] = useState([])
  const [filterDepartment, setFilterDepartment] = useState('');

  console.log('depp', departments);
  console.log('filtfaclty', filteredFaculty);

  const navigate = useNavigate();

  const token = localStorage.getItem("access"); 

  useEffect(() => {
    const AllFacultyData = async () => {
      try {
        const response = await FacultyApi();
        console.log("API Response:", response);
        if (response.status === 200) {
          setFacultyList(response.data);
        } else {
          toast.error("Failed to fetch faculty list.");
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast.error("An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    AllFacultyData();
  }, []);

  useEffect(() => {
    const allDepartments = async () => {
      try {
        const response = await departmentApi()
        setDepartments(response.data)
      } catch (error) {
        console.log("error fetching dept", error);
      }
    }
    allDepartments()
  }, [])

  useEffect(() => {
    if (!facultyList || facultyList.length === 0) return; // Ensure data exists

    let filteredList = facultyList; // Default: all HODs

    if (filterDepartment) {
      filteredList = facultyList.filter(fac => String(fac.department) === String(filterDepartment));
    }

    console.log('Filtered HODs:', filteredList);
    setFilteredFaculty(filteredList);
  }, [facultyList, filterDepartment]);




  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) {
      return;
    }

    try {
      const response = await deleteFacultyApi(facultyId, token);
      if (response.status === 204) {
        setFacultyList(facultyList.filter((faculty) => faculty.id !== facultyId));
        toast.success("Faculty deleted successfully.");
      } else {
        toast.error("Failed to delete faculty.");
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error("An error occurred while deleting.");
    }
  };
  // Handle edit faculty details
  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    console.log(faculty);

    setShowModal(true);

  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'photo') {
      setSelectedFaculty((prevFaculty) => ({
        ...prevFaculty,
        [name]: e.target.files[0],
      }));
    } else {
      setSelectedFaculty((prevFaculty) => ({
        ...prevFaculty,
        [name]: value,
      }));
    }
  };


  // Handle form input change
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedFaculty((prevFaculty) => ({
  //     ...prevFaculty,
  //     [name]: value,
  //   }));
  // };

  // const handlePhotoChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFaculty((prevFaculty) => ({
  //       ...prevFaculty,
  //       photo: file,
  //     }));
  //   }
  // };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("full_name", selectedFaculty.full_name);
    formData.append("email", selectedFaculty.email);
    formData.append("password", selectedFaculty.password);
    formData.append("phone", selectedFaculty.phone);
    formData.append("dob", selectedFaculty.dob);
    formData.append("gender", selectedFaculty.gender);
    formData.append("department", selectedFaculty.department);
    formData.append("role", selectedFaculty.role);
    if (selectedFaculty.photo) {
      formData.append("photo", selectedFaculty.photo);
    }

    try {
      const response = await editFacultyApi(selectedFaculty.id, formData, token, true);
      if (response.status === 200) {
        toast.success("Faculty details updated!");
        setShowModal(false);
        // setFacultyList(facultyList.map((faculty) => (faculty.id === selectedFaculty.id ? response.data : faculty)));
      } else {
        toast.error("Failed to update faculty details.");
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className=" container">
      <h2 className='title'>Faculty List</h2>

      <Row className="justify-content-center">
        <Col lg={10}>
          <Form.Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}

          </Form.Select>
        </Col>
      </Row>
      <Row className="justify-content-center">

        <Col lg={10}>

          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" size="lg" />
            </div>
          ) : (
            <div className="tablecontainer p-4 ">
              <Table striped bordered hover className="bg-white w-100">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Gender</th>
                    <th>Photo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.length > 0 ? (
                    filteredFaculty.map((faculty, index) => (
                      <tr key={faculty.id}>
                        <td>{index + 1}</td>
                        <td>{faculty.full_name}</td>
                        <td>{faculty.email}</td>
                        <td>{faculty.phone}</td>
                        <td>{faculty.department?.department_name || "N/A"}</td>
                        <td>{faculty.gender}</td>
                        <td>
                          {faculty.photo ? (
                            <img
                              src={`${serverUrl}${faculty.photo}`}
                              alt={faculty.full_name}
                              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            />
                          ) : (
                            "No Photo"
                          )}
                        </td>
                        <td className="faculty-actions">
                          <button className='edit-icon' onClick={() => handleEdit(faculty)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(faculty.id)} className="delete-icon">
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No faculty members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

            </div>
          )}
        </Col>
      </Row>

      {/* Edit Faculty Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Faculty Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="full_name" value={selectedFaculty?.full_name || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={selectedFaculty?.email || ""} onChange={handleChange} />
            </Form.Group>
            {/* <Form.Group className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={selectedFaculty?.password || ""} onChange={handleChange} />
        </Form.Group> */}
            <Form.Group className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="number" name="phone" value={selectedFaculty?.phone || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="department" className="mt-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={selectedFaculty?.department?.id || ""}
                onChange={(e) =>
                  setSelectedFaculty({
                    ...selectedFaculty,
                    department: { id: e.target.value, department_name: departments.find(d => d.id == e.target.value)?.department_name }
                  })
                }
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control type="text" name="gender" value={selectedFaculty?.gender || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" name="role" value={selectedFaculty?.role || ""} onChange={handleChange} />
            </Form.Group>
        <Form.Group className="mt-3">
                     <Form.Label>Current Photo</Form.Label>
                     <div>
                       {selectedFaculty?.photo && (
                         <img
                           src={selectedFaculty.photo instanceof File ? URL.createObjectURL(selectedFaculty.photo) : `${serverUrl}${selectedFaculty.photo}`}
                           alt="HOD"
                           style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                         />
                       )}
                     </div>
                     <Form.Control type="file" name="photo" onChange={handleChange} />
                   </Form.Group>

            <Button variant="primary" type="submit" className="mt-4 w-100" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default ViewFaculty;
