import React from 'react';
import './footer.css';
import logo from '../assets/logo.png'; // Replace path as needed
import { MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo and Title */}
        <div className="footer-logo">
          <img src={logo} alt="College Logo" className="logo-image" />
          <h2>BV COLLEGE</h2>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/departments">Departments</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div className="footer-section">
          <h4>Policies</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/code-of-conduct">Code of Conduct</a></li>
          </ul>
        </div>

        {/* Contact Info */}
  <div className="footer-section">
  <h4>Connect</h4>
  <ul>
    <li><MdPhone /> +1 234-567-890</li>
    <li>📧 <a href="mailto:info@xyzcollege.edu">info@bvcollege.edu</a></li>
    <li>🔗 <a href="https://xyzcollege.edu" target="_blank" rel="noopener noreferrer">bvcollege.edu</a></li>
  </ul>
</div>


      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} BVCOLLEGE. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
