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
      
    <div className='photos d-flex'>
        <div className='head'>
          <h1> Our <br /> <span >Campus</span> <br /> View</h1>
        </div>
        <div className="college-grid">
          {images.map((image, index) => (
            <div className="college-card" key={index}>
              <img src={image.src} alt={image.title} /> 
              <h3>{image.title}</h3>
            </div>
          ))}
        </div>
    </div>


    </div>
  );
};

export default College;
