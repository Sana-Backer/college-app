import React, { useState } from 'react';
import './header.css';
import { FaTimes, FaUser, FaBars } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";

const Header = () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className='navbar-custom d-flex align-items-center pt-3'>
            {/* Logo */}
            <h2 className='text-light ms-3'>BVCollege</h2>

            {/* Hamburger Icon */}
            <div className="menu-icon d-md-none ms-auto me-3" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>

            {/* Navigation Links */}
            <div className={`links d-flex gap-5 ms-auto p-1 me-5 ${menuOpen ? 'active' : 'hidden'}`}>
                <Link to="/home">Home</Link>
                {role === "student" && <Link to="/studentDash">Student Dashboard</Link>}
                {role === "hod" && <Link to="/hodDash">HOD Dashboard</Link>}
                {role === "faculty" && <Link to="/facultydash">Faculty Dashboard</Link>}
                <Link to="/AllDept">Departments</Link>
                <Link to="/helpline">Contact Us</Link>

                {/* User Info */}
                <div className='d-flex mt-1'>
                        <FaUser className='text-light' />
                        <p className='ms-1 text-light'>{username}</p>
                    </div>

                {/* Logout */}
                <div className='logout' onClick={handleLogout}>
                    <IoIosLogOut />
                </div>
            </div>
        </div>
    );
};

export default Header;
