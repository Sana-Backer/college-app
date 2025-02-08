import React, { useEffect, useState } from 'react';
import course from '../assets/course1.webp';
import phy from '../assets/phy.avif'
import maths from '../assets/maths.jpg'
import bca from '../assets/bca.jpg'

import './courses.css';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const Courses = () => {
  const courses = [
    { title: "B TECH", image: course },
    { title: "BSC PHYSICS ", image: phy },
    { title: "BSC MATHS ", image: maths },
    { title: "BCA ", image: bca },
    { title: "Course 5", image: course },
    { title: "Course 6", image: course },
    { title: "Course 7", image: course },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCourses = 4; 

  const handleNext = () => {
    if (currentIndex + visibleCourses < courses.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleNext();
  //   }, 3000);
  
  //   return () => clearInterval(interval); 
  // }, [currentIndex]);
  
  

  return (
    <section className="courses container">
      <h2 className="text-center">Courses</h2>
      <hr />
      <div className='d-flex arrows gap-3'>
        <button className='arrow btn p-2' onClick={handlePrev} disabled={currentIndex === 0}>
          <SlArrowLeft />
        </button>
        <button className='arrow btn p-2' onClick={handleNext} disabled={currentIndex + visibleCourses >= courses.length}>
          <SlArrowRight />
        </button>
      </div>

      <div className='wrapper d-flex flex-row gap-1 '>
        {courses.slice(currentIndex, currentIndex + visibleCourses).map((course, index) => (
          <div key={index} className="course-card ms-auto">
            <div className="image-container">
              <img src={course.image} alt='' className="course-image" />
              <div className="course-title">
                <h6>{course.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses;
