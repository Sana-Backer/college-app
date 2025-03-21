import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginApi } from "../Services/allAPI";
import { toast, ToastContainer } from "react-toastify";

function SignUp() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
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
        // Storing the token and user data in localStorage
        localStorage.setItem("loggedUser", JSON.stringify(result.data));
        localStorage.setItem("access", result.data.access);
        localStorage.setItem("role", result.data.role);

        setUserData({ email: "", password: "" });
        toast.success("Login successful");
        navigate("/admin-home");
      } else if (result.status === 401) {
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
    <div
      className="row w-100 d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="row w-75 mt-5" style={{ height: "470px" }}>
        <div className="col-md-6 shadow d-flex justify-content-center align-items-center flex-column p-5">
          <div
            className="p-3 d-flex justify-content-center align-items-center"
            style={{
              height: "70px",
              width: "70px",
              border: "3px solid red",
              borderRadius: "50px",
            }}
          >
            <i className="fa-solid fa-lock fa-2x text-primary"></i>
          </div>
          <h2 className="text-center text-primary d-flex">Welcome Admin</h2>
          <form
            className="border rounded p-3 w-100 shadow mt-3"
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
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
        <div
          className="col-md-6 shadow p-0 d-flex justify-content-center align-items-center flex-column text-light"
          style={{
            backgroundImage:
              "url('https://us.123rf.com/450wm/mashmuh/mashmuh2012/mashmuh201200408/160498085-online-registration-or-sing-up-concept-young-woman-logs-into-the-site-young-woman-posting-resume.jpg?ver=6')",
            backgroundSize: "cover",
          }}
        >
          <div className="d-flex justify-content-center align-items-center flex-column"></div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
