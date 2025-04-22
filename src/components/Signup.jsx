import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginApi } from "../Services/allAPI";
import { toast, ToastContainer } from "react-toastify";
import { IoLockClosedOutline } from "react-icons/io5";
import './signup.css'

function SignUp() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      toast.error("Please enter all fields");
      return;
    }

    try {
      const result = await loginApi(userData);
      if (result.status === 200) {
        localStorage.setItem("loggedUser", JSON.stringify(result.data));
        localStorage.setItem("access", result.data.access);
        localStorage.setItem("role", result.data.role);
        if (result.data.role === "admin") {
          setUserData({ email: "", password: "" });
          toast.success("Login successful");
          navigate("/admin-home");
        } else {
          alert("Access denied! You are not an admin.");
          // navigate("/"); 
        }
  
      } else if (result.status === 401) {
        console.log("not admin");
        
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    }
  };


  return (
    <div className="login-page w-100 d-flex justify-content-center align-items-center">
      <div className="login-container row  w-75 mt-5" >
        <div className="col-md-6 admin-login shadow d-flex justify-content-center align-items-center flex-column p-5">
          <div
            className=" p-3 d-flex justify-content-center align-items-center"
            style={{
              height: "70px",
              width: "70px",
              background: '#f9f9f93e3',
              borderRadius: "50px",
            }}
          >
            <IoLockClosedOutline className="login-icon" />
          </div>

          <h2 className="text-center d-flex">Admin Portal</h2>
          <p className="">Enter your credentials to access the admin dashboard</p>
          <form
            className=" rounded w-100  mt-3"
            onSubmit={handleLogin}
          >
            <div className="mb-4 mt-3">
              <input
                name="email"
                type="text"
                placeholder="Enter email"
                className="form-control"
                value={userData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="form-control"
                value={userData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <button className="login-button w-25 bg-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-6 shadow p-0 d-flex justify-content-center align-items-center flex-column " style={{ marginLeft: '-15px' }}>
          <h1 style={{ fontWeight: '600', fontSize: '40px' }}> Welcome to College <br />Admin Portal</h1>
          <p className="text-dark w-75 " style={{ fontSize: '19px', textAlign: "center" }}>Manage student inquiries, update college information, and monitor chat support all in one place.</p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
