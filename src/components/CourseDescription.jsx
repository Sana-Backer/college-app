import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCoursesApi } from "../Services/allAPI";
import "./Coursedes.css";

function CourseDescription() {
  const location = useLocation();
  const { department } = location.state || {}; // Access passed state
  const [allCourses, setAllCourses] = useState([]);
const serverUrl = 'http://localhost:8000';
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi();
        if (response.status === 200) {
          setAllCourses(response.data);
        } else {
          console.error("Failed to fetch courses:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  if (!department) {
    return <div>No department details available.</div>;
  }

  return (
    <>
      <div className="cd-main my-1" id="description">
        <div className="ms-auto">
          <Link className="link-back my-2" to="/home">Back</Link>
        </div>
        <div className="c-description shadow">
          {/* Department Photo */}
         {department.photo && (
  <img 
    src={`${serverUrl}${department.photo}`} 
    alt={department.department_name} 
    className="department-photo mb-3"
    style={{
      width: "100%",
      height: "300px", 
      objectFit: "cover", 
      borderRadius: "15px", 
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
    }}
  />
)}

          <div className="c-description-head justify-content-center align-items-center d-flex">
            <h2>{department.department_name}</h2>
          </div>
          <div className="cd-para">
            <p>{department.description}</p>
          </div>

          {/* Courses */}
          <div className="courses-list d-flex flex-wrap gap-3 mt-4">
            {department.courses.map((courseId) => {
              const course = allCourses.find((c) => c.id === courseId);
              return (
                <div key={courseId} className="course-card p-3 shadow rounded" style={{ width: "250px" }}>
                  {course ? (
                    <>     
                      <h5 className="mt-2">{course.course_name}</h5>
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}

export default CourseDescription;
