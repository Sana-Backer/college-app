import React from 'react';
import './header.css';
import logo from '../assets/logo.png';
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";

const Header = () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        localStorage.clear();
        navigate("/");
    };

    return (
        <>
            <div className='navbar-custom d-flex pt-3'>
                <div>
                    <h2 className='text-light ms-3'>BVCollege</h2>
                </div>
                <div className='links d-flex gap-5 ms-auto p-1 me-5'>
                    <Link to="/home" style={{ textDecoration: "none" }}>Home</Link>
                    {role === "student" && (
                        <Link to="/studentDash" style={{ textDecoration: "none" }}>
                            Student Dashboard
                        </Link>
                    )}
                    {role === "hod" && (
                        <Link to="/hodDash" style={{ textDecoration: "none" }}>
                            HOD Dashboard
                        </Link>
                    )}
                    {role === "faculty" && (
                        <Link to="/facultydash" style={{ textDecoration: "none" }}>
                         Faculty Dashboard
                        </Link>
                    )}
                    <Link to="/courses" style={{ textDecoration: "none" }}>Courses</Link>
                    <Link to="/helpline" style={{ textDecoration: "none" }}>Helpline</Link>
                    <div className='d-flex mt-1'>
                        <FaUser className='text-light' />
                        <p className='ms-1 text-light'>{username}</p>
                    </div>
                    <div className='logout' onClick={handleLogout}>
                        <IoIosLogOut />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
