import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
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
import FacultyAttendanceRecord from './components/hod/FacultyAttendenceRecord'
import ResultStd from './components/ResultStd'
import Departments from "./components/Departments";
import CourseDescription from "./components/CourseDescription";
import AllDept from "./components/AllDept";
import Courses from "./components/Courses";
import ViewNotifications from "./components/ViewNotifications";
import AttendanceView from "./components/faculty/AttendenceSheetStd";
import ChatInterface from "./components/chatbot";
import AttendanceRecord from "./components/faculty/AttendanceRecord";
import StudentAttendance from './components/faculty/StudentAttendence'
import Footer from "./components/Footer";
function App() {
  const ProtectedRoute = ({ element, allowedRoles }) => {
    const authToken = localStorage.getItem("access");
    const userRole = localStorage.getItem("role");

    if (authToken && allowedRoles.includes(userRole)) {
      return element;
    }

    return <Navigate to="/" replace />;

  };
  return (

    <>

      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/studentDash" element={<ProtectedRoute  element={<StudentDash />} allowedRoles={["student"]} />}></Route>
        <Route path="/hoddash" element={<HodDash />}></Route>
        <Route path="/hod/:hodId" element={<HodProfile />} />
        <Route path="/faculty-attendance-record" element={<FacultyAttendanceRecord />} />
        <Route path="/student-attendance" element={<AttendanceRecord />} />
        <Route path="/attendance" element={<StudentAttendance />} />


        <Route path="/facultydash" element={<FacultyDash />}></Route>

        <Route path="/admin-home" element={<ProtectedRoute  element={<AdminHome />} allowedRoles={["admin"]} />}></Route>
        <Route path="/Otp" element={<Otp />}></Route>


        <Route path="/home" element={<Home />}></Route>
        <Route path="/AddHod" element={<AddHod />}></Route>
        <Route path="/Departments" element={<Departments />} />
        <Route path="/coursedescription" element={<CourseDescription />} ></Route>
        <Route path="/AllDept" element={<AllDept />} ></Route>

        <Route path="/Courses" element={<Courses />} />
        <Route path="/contactus" element={<Footer />} />

        <Route path="/ResultStd" element={<ResultStd />} />
        <Route path="/chat" element={<ChatInterface />}></Route>
      </Routes>
      \      <ToastContainer />
    </>
  );
}

export default App;
