import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddAssignment = ({ role, username }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [deadline, setDeadline] = useState('');
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available batches from API
    const fetchBatches = async () => {
      try {
        const response = await fetch('/api/batches/'); // Adjust API endpoint as needed
        const data = await response.json();
        setBatches(data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assignmentData = {
      title,
      description,
      faculty: username, // Assuming username is mapped to faculty
      batch,
      deadline,
    };

    try {
      const response = await fetch('/api/assignments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (response.ok) {
        toast.success('Assignment uploaded successfully!');
        navigate('/assignments'); // Redirect to assignments page after success
      } else {
        toast.error('Failed to upload assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Container className="add-note-container">
      <h2>Upload Assignment Topic</h2>
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

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="batch">
          <Form.Label>Batch</Form.Label>
          <Form.Control
            as="select"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
          >
            <option value="">Select a Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="deadline">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>{role === 'HOD' ? 'HOD Username' : 'Faculty Username'}</Form.Label>
          <Form.Control type="text" value={username} readOnly />
        </Form.Group>

        <Button className="my-2" variant="primary" type="submit">
          Upload
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddAssignment;
