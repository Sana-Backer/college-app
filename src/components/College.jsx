import React from 'react';
import campus from '../assets/campus.jpg';
import classroom from '../assets/class.jpg';
import canteen from '../assets/canteen.jpg';
import library from '../assets/library.jpg';
import sports from '../assets/sport.jpg';
import './college.css'
const images = [
  { src: library, title: "Library" },
  { src: classroom, title: "Classroom" },
  { src: canteen, title: "Canteen" },
  { src: sports, title: "Sports" }
];

const College = () => {
  return (
    <div className="college-section">
      <h2>Our College</h2>
      
    <div className='photos d-flex'>
        <div ><img src={campus} className='main-photo'  alt="" /></div>
        <div className="college-grid">
          {images.map((image, index) => (
            <div className="college-card" key={index}>
              <img src={image.src} alt={image.title} /> 
            </div>
          ))}
        </div>
    </div>


    </div>
  );
};

export default College;
