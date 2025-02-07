import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import StudentDash from "./pages/StudentDash";
import Home from "./pages/Home";

import AddHod from "./components/Admin/AddHod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Otp from "./components/Otp";
import AdminHome from "./components/Admin/AdminHome";
import HodDash from "./pages/HodDash";
import FacultyDash from "./pages/FacultyDash";
import HodProfile from "./components/hod/HodProfile";


function App() {
  return (
    <>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/studentDash" element={<StudentDash />}></Route>
        <Route path="/hoddash" element={<HodDash />}></Route>
        <Route path="/hod/:hodId" element={<HodProfile  />} />

        <Route path="/facultydash" element={<FacultyDash />}></Route>
        
        <Route path="/admin-home" element={<AdminHome />}></Route>
        <Route path="/Otp" element={<Otp />}></Route>


        <Route path="/home" element={<Home />}></Route>
        <Route path="/AddHod" element={<AddHod />}></Route> 
      </Routes>
\      <ToastContainer />
    </>
  );
}

export default App;
