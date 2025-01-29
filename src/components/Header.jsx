import React from 'react';
import './header.css';
import logo from '../assets/logo.png';
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";

const Header = () => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    return (
        <>
            <div className='navbar-custom d-flex pt-3'>
                <div>
                    {/* <img
            alt=""
            src={logo}
            width="55"
            height="55"
            className="d-inline-block align-top ms-5"
            style={{ borderRadius: '30px' }}
          /> */}<h2 className='text-light ms-3'>BVCollege</h2>
                </div>
                <div className='links d-flex gap-5 ms-auto p-1 me-5'>
                    <a href="">Home</a>
                    {role === "student" && (
                        <Link to="/studentDash" style={{ textDecoration: "none" }}>
                            Student Dashboard
                        </Link>
                    )}
                    {role === "hod" && (
                        <Link to="/hodDash" style={{ textDecoration: "none" }}>
                            <button className="sign-in-btn">HOD Dashboard</button>
                        </Link>
                    )}
                    {role === "faculty" && (
                        <Link to="/teacherDash" style={{ textDecoration: "none" }}>
                            <button className="sign-in-btn">Faculty Dashboard</button>
                        </Link>
                    )}
                    <a href="">Courses</a>
                    <a href="">Helpline</a>
                    <a href="" className='d-flex mt-1'>
                        <FaUser />
                        <p className=''>{username}</p>
                    </a>
                    <a href="" className='logout'>
                        <IoIosLogOut />
                    </a>
                </div>
            </div>
        </>
    )
}

export default Header;
