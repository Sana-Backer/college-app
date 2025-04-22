import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addSubjectApi, departmentApi, getCoursesApi } from '../../Services/allAPI';

const AddSubject = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [token] = useState(localStorage.getItem('access'));

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentApi(token);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi(token);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchDepartments();
    fetchCourses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjectData = { name, department, course };

    try {
      const response = await addSubjectApi(token, subjectData);
      if (response.status === 201) {
        toast.success('Subject added successfully!');
        setName('');
        setDepartment('');
        setCourse('');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Error adding subject. Please try again.');
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>Add Subject</h1>
            <p>Enter subject details to create a new entry</p>
          </header>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="name">Subject Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter subject name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="select-field"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="course">Course</label>
                <select
                  id="course"
                  name="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="select-field"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Subject
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddSubject;
