import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { getBatchApi, editBatchApi, deleteBatchApi } from '../../Services/allAPI';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ViewBatch = () => {
    const [batches, setBatches] = useState([]);
    const token = localStorage.getItem('token');
    const [error, setError] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [batchName, setBatchName] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');

    // Fetch all batches
    const fetchBatches = async () => {
        try {
            const response = await getBatchApi(token);
            if (response?.data && Array.isArray(response.data)) {
                setBatches(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
            setError('Failed to fetch batches. Please check your authorization token.');
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    // Handle Edit Click
    const handleEdit = (batch) => {
        setSelectedBatch(batch);
        setBatchName(batch.batch_name);
        setStartYear(batch.start_year);
        setEndYear(batch.end_year);
        setShowModal(true);
    };

    // Handle Edit Save
    const handleEditSave = async () => {
        if (!selectedBatch || !batchName.trim() || !String(startYear).trim() || !String(endYear).trim()) {
            alert("Please fill all fields.");
            return;
        }
    
        try {
            const updatedData = {
                batch_name: batchName,
                start_year: Number(startYear),  
                end_year: Number(endYear),      
                course: selectedBatch.course // ✅ Include course ID to prevent the 400 error
            };
    
            await editBatchApi(selectedBatch.id, token, updatedData);
    
            setBatches(batches.map(batch => 
                batch.id === selectedBatch.id ? { ...batch, ...updatedData } : batch
            ));
    
            setShowModal(false);
        } catch (error) {
            console.error("Error updating batch:", error);
        }
    };
    

    // Handle Delete
    const handleDelete = async (batchId) => {
        if (!window.confirm("Are you sure you want to delete this batch?")) return;

        try {
            await deleteBatchApi(batchId, token);

            // Remove deleted batch from state
            setBatches(batches.filter(batch => batch.id !== batchId));
        } catch (error) {
            console.error("Error deleting batch:", error);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Batch List</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="tablecontainer">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Batch Name</th>
                            <th>Course Name</th>
                            <th>Start Year</th>
                            <th>End Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.length > 0 ? (
                            batches.map((batch) => (
                                <tr key={batch.id}>
                                    <td>{batch.id}</td>
                                    <td>{batch.batch_name}</td>
                                    <td>{batch.course || 'N/A'}</td>
                                    <td>{batch.start_year}</td>
                                    <td>{batch.end_year}</td>
                                    <td>
                                        <Button variant="warning" size="sm" onClick={() => handleEdit(batch)}>
                                            <FaEdit />
                                        </Button>{' '}
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(batch.id)}>
                                            <FaTrashAlt />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No batches found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Batch</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Batch Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={batchName} 
                                onChange={(e) => setBatchName(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Year</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={startYear} 
                                onChange={(e) => setStartYear(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Year</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={endYear} 
                                onChange={(e) => setEndYear(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ViewBatch;
