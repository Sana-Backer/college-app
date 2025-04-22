import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addbatchApi, getCoursesApi } from "../../Services/allAPI";
import './addbatch.css'
const AddBatch = () => {
  const [formData, setFormData] = useState({
    batch_name: "",
    course: "",
    start_year: "",
    end_year: "",
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const allCourses = async () => {
      try {
        const response = await getCoursesApi();
        if (response.status === 200) {
          setCourses(response.data);
        } else {
          toast.error("Failed to get courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    };
    allCourses();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.start_year > formData.end_year) {
      toast.error("Start year cannot be after end year.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await addbatchApi(formData);
      if (response.status === 201 || response.status === 200) {
        toast.success("Batch added successfully!");
        setFormData({
          batch_name: "",
          course: "",
          start_year: "",
          end_year: "",
        });
      } else {
        toast.error("Failed to add batch. Please check the inputs.");
      }
    } catch (error) {
      toast.error("Error adding batch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>Add Batch</h1>
            <p>Fill in the batch details below</p>
          </header>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="batch_name">Batch Name</label>
                <input
                  type="text"
                  id="batch_name"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Eg: BCA 2021-2024"
                  required
                />
              </div>

         

              <div className="input-group">
                <label htmlFor="start_year">Start Year</label>
                <input
                  type="number"
                  id="start_year"
                  name="start_year"
                  value={formData.start_year}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="end_year">End Year</label>
                <input
                  type="number"
                  id="end_year"
                  name="end_year"
                  value={formData.end_year}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="course">Course</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="select-field"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Add Batch"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBatch;
