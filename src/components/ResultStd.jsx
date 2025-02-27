import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilePdf, FaExclamationTriangle } from 'react-icons/fa';
import { ExamResultApi } from '../Services/allAPI';

const ResultStd = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (token) {
      fetchResults();
    } else {
      toast.error("Unauthorized: Please log in.");
      setLoading(false);
    }
  }, [token]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await ExamResultApi(token);
      if (response.length > 0) {
        const updatedResults = response.map((result) => ({
          ...result,
          fileUrl: result.file ? `http://localhost:8000${result.file}` : null
        }));
        setResults(updatedResults);
      } else {
        setResults([]);
        toast.warn("No results found.");
      }
    } catch (error) {
      console.error("Error fetching exam results:", error);
      toast.error(error.response?.data?.message || "Error fetching exam results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-result-container">
      <h2 className="result-title">Exam Results</h2>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <FaExclamationTriangle className="no-results-icon" />
          <p>No results available.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="result-table">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Title</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id}>
                  <td data-label="SI.No">{index + 1}</td>
                  <td data-label="Title">{result.title}</td>
                  <td data-label="File">
                    {result.fileUrl ? (
                      <a
                        className="pdf-link"
                        href={result.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFilePdf className="pdf-icon" />
                        <span>View PDF</span>
                      </a>
                    ) : (
                      <p className="no-pdf">No PDF available</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />


    </div>
  );
};

export default ResultStd;
