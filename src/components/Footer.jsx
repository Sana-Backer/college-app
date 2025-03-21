import React from 'react'
import './footer.css'

const Footer = () => {
  return (
    <div id='contactus' className="college-container shadow  my-2">
    <div className='college-info'>
       <h3 className="text-center">🏫 BVCOLLEGE</h3>
       <p>
       XYZ College of Engineering is a premier institution dedicated to academic excellence and innovation. Our college offers a wide range of undergraduate and postgraduate programs, state-of-the-art infrastructure, and a faculty committed to nurturing future leaders. We emphasize a holistic learning approach that integrates theoretical knowledge with practical applications, ensuring students are well-prepared for industry challenges.

       </p>
 
    </div>
    <div className='college-contact-d'>
       <h4 className="mt-4">Contact Details</h4>
       <ul className="college-contact">
         <li><strong>Address:</strong> 123 Main Street, City, State, ZIP</li>
         <li><strong>Phone:</strong> +1 234-567-890</li>
         <li><strong>Email:</strong> info@xyzcollege.edu</li>
         <li><strong>Website:</strong> <a href="https://www.xyzcollege.edu" target="_blank" rel="noopener noreferrer">www.xyzcollege.edu</a></li>
       </ul>
    </div>
   </div>

  )
}

export default Footer