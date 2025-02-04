import React, { useEffect, useState } from 'react';
import { StudentApi } from '../../Services/allAPI';

const Studentlist = () => {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    allStudentList();
  }, []);

  const allStudentList = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('No token found in localStorage');
      setLoading(false);
      return;
    }
    try {
      const response = await StudentApi(token);
      console.log(response.data);
      setStudentList(response.data);
    } catch (err) {
      setError('Error fetching student details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!studentList.length) return <p>No student data available</p>;

  return (
    <div>
      <h2>Students List</h2>
      <ul>
        {studentList.map((student) => (
          <li key={student.id}>
            {student.full_name} - {student.department}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Studentlist;
