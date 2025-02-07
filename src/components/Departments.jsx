import React, { useState, useEffect } from "react";
import "./departments.css";
import { Link } from "react-router-dom";
import { departmentApi } from "../Services/allAPI";

const serverUrl = 'http://localhost:8000';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const AllDepartments = async () => {
      try {
        const response = await departmentApi();
        if (response.status === 200 && Array.isArray(response.data)) {
          setDepartments(response.data.slice(0, 6)); // Display only the first 6 departments
        } else {
          setError("Failed to fetch departments data.");
        }
      } catch (err) {
        setError("Error fetching departments: " + err.message);
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    AllDepartments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  if (!departments || departments.length === 0) {
    return <div>No departments available.</div>; // Fallback if no departments
  }

  return (
    <>
      <div className="head-course-text my-2">
        <p className="text-center fs-4">Most Popular Courses</p>
      </div>

      <div className="course-box">
        {departments.map((department, index) => {
          const imageUrl = department.photo;
          return (
            <div className="dept-card" key={index}>
              <div className="image-container">
                <img
                  className="dept-img"
                  src={`${serverUrl}${imageUrl}`}
                  alt={department.department_name}
                />
                <div className="dept-title">
                  <p className="cp1">{department.department_name}</p>
                  <Link to={{
                    pathname: "/coursedescription" }} state={{ department }} style={{ textDecoration: 'none' }}> 
                    <p className="text-warning">
                      See Course Guide <i className="fa-solid fa-arrow-right"></i>
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="see-more-container">
        <Link to="/alldept" className="see-more-link">
          See More
        </Link>
      </div>
    </>
  );
}

export default Departments;