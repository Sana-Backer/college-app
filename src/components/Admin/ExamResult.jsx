import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { uploadExamResultApi } from '../../Services/allAPI';
import './ExamResult.css'; // Import CSS file

const ExamResult = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('access');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('No file selected');
      return;
    }

    try {
      const response = await uploadExamResultApi(token, title, file);
      if (response.status === 201) {
        toast.success('Exam result uploaded successfully');
        if (file.type === 'application/pdf') {
          setTitle('');
          setFile(null);
        }
      } else {
        toast.error('Failed to upload exam result');
      }
    } catch (error) {
      toast.error(error.response?.data?.file?.[0] || 'Error uploading exam result');
    }
  };

  return (
    <div className="result-upload-container">
      <div className="exam-card">
        <h2>Upload Exam Results</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Choose File</label>
            <input
              type="file"
              accept=".pdf,.docx,.xlsx"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" className="result-upload-btn">Upload</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExamResult;
