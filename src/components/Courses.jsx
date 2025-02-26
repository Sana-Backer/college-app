import React, { useEffect, useState } from "react";
import "./courses.css";
import { getCoursesApi } from "../Services/allAPI";
import { FaGraduationCap } from "react-icons/fa6";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const allCourses = async () => {
      try {
        const response = await getCoursesApi();
        setCourses(response.data);
      } catch (error) {
        console.log("Error fetching courses", error);
      }
    };
    allCourses();
  }, []);

  return (
    <div className="Courses container mt-3">
      <div className="course-head">
        <h3>Courses</h3>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-4 mt-4">
        {courses.map((c) => (
          <div className="course-card" key={c.id}>
            <div className="course-icon">
              <FaGraduationCap />
            </div>
            <h2>{c.course_name}</h2>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
