import React, { useEffect, useState } from "react";
import "./addhod.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { departmentApi, registerApi } from "../../Services/allAPI";

function AddHod() {
  const [userData, setUserData] = useState({
    full_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    photo: null,
    role: "hod",
  });
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const departments = async () => {
      try {
        const response = await departmentApi()
        setDepartments(response.data)
      } catch (error) {
        setError("Failed to fetch departments", error)
      }
    }
    departments()
  },[])

  const handleChange = (e) => {
    const { name, value , files} = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "photo") {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size <= 2 * 1024 * 1024) {
          setUserData({ ...userData, photo: file });
        } else {
          toast.error("Image size must be less than 2MB.");
        }
      } else {
        toast.error("Please upload a valid image file.");
      }
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { full_name, dob, gender, email, phone, password, department , photo } = userData;
    if (!full_name || !dob || !gender || !email || !phone || !password || !department || !photo) {
      toast.warning("Please fill out all fields");
      setIsLoading(false);
      return;
    }

        try {
          const formData = new FormData();
          formData.append("full_name", full_name);
          formData.append("dob", dob);
          formData.append("gender", gender);
          formData.append("email", email);
          formData.append("phone", phone);
          formData.append("password", password);
          formData.append("department", department);
          formData.append("role", userData.role);
          formData.append("photo", photo);
    
          const response = await registerApi(formData);
          if (response.status === 200) {
            toast.success("OTP sent successfully");
            setUserData({
              full_name: "",
              dob: "",
              gender: "",
              email: "",
              phone: "",
              password: "",
              department: "",
              photo: null,
              role: "hod",
            });
            navigate("/Otp", { state: { email } });
          } else {
            toast.error("Registration failed! Please try again.");
          }
        } catch (error) {
          toast.error("An unexpected error occurred. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
    

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>HOD Registration</h1>
            <p>Enter HOD details to create a new account</p>
          </header>

          <form onSubmit={handleRegistration} className="registration-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" placeholder="Enter full name" value={userData.full_name} onChange={handleChange} className="input-field" />
              </div>

              <div className="input-group">
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" value={userData.dob} onChange={handleChange} className="input-field" />
              </div>

              <div className="input-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={userData.gender} onChange={handleChange} className="select-field">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter phone number" value={userData.phone} onChange={handleChange} className="input-field" />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter email address" value={userData.email} onChange={handleChange} className="input-field" autoComplete="email" />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Create password" value={userData.password} onChange={handleChange} className="input-field" autoComplete="new-password" />
              </div>

              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select id="department" name="department" value={userData.department} onChange={handleChange} className="select-field">
                  <option value="">Select Department</option>
                  {departments.map((D)=>(
                    <option key={D.id} value={D.id}>{D.department_name}</option>
                  ))
                    
                 }
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="photo">Profile Image</label>
                <input type="file" id="photo" name="photo" onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate("/")}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? "Processing..." : "Register HOD"}</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddHod;
