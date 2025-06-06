import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addDepartment.css"; // Reuse same styling
import { addCourseApi } from "../../Services/allAPI";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    course_name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseData.course_name.trim() || !courseData.description.trim()) {
      toast.error("All fields are required!");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("You must be logged in to add a course.");
      return;
    }

    setLoading(true);

    try {
      const response = await addCourseApi(courseData, token);
      if (response.status === 201) {
        toast.success("Course added successfully.");
        setCourseData({ course_name: "", description: "" });
      } else {
        toast.error(response.data?.message || "Error adding course. Try again.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>Add Course</h1>
            <p>Enter course details to create a new entry</p>
          </header>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="course_name">Course Name</label>
                <input
                  type="text"
                  id="course_name"
                  name="course_name"
                  placeholder="Enter course name"
                  value={courseData.course_name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="input-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter course description"
                  value={courseData.description}
                  onChange={handleChange}
                  className="input-field"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/view-courses")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCourse;
