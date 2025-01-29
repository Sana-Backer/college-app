import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
// import TeachDash from "./Pages/TeachDash";
import StudentDash from "./pages/StudentDash";
import Home from "./pages/Home";
// import Overview from "./Components/Overview";
// import AddUser from "./Components/AddUser";
// import AddStudent from "./Components/AddStudent";
// import AddTeach from "./Components/AddTeach";
// import Hod from "./Pages/Hod";
// import AddHod from "./Components/AddHod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Otp from "./components/Otp";
// import CourseDescription from "./Components/CourseDescription";
// import ProfileEdit from "./Components/ProfileEdit";
// import AddDepartment from "./Components/AddDepartment";
// import AdminPortal from "./Components/AdminPortal";
// import AdminHome from "./Components/AdminHome";
// import Settings from "./Components/Settings";
// import Profile from "./Components/Profile";
// import FacultyList from "./Components/FacultyList";
// import StudentList from "./Pages/StudentList";

function App() {
  return (
    <>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/studentDash" element={<StudentDash />}></Route>

        {/* <Route path="/teacherDash" element={<TeachDash />}></Route>
        <Route path="/hodDash" element={<Hod />}></Route> */}
        <Route path="/home" element={<Home />}></Route>
        {/* <Route path="/Overview" element={<Overview />}></Route>
        <Route path="/Add" element={<AddUser />}></Route>
        <Route path="/AddStudent" element={<AddStudent />}></Route>
        <Route path="/AddTeacher" element={<AddTeach />}></Route>
        <Route path="/AddHod" element={<AddHod />}></Route> */}
        <Route path="/Otp" element={<Otp />}></Route>
        {/* <Route
          path="/coursedescription"
          element={<CourseDescription />}
        ></Route>
        <Route path="/facultyList" element={<FacultyList />}></Route>
        <Route path="/addDepartment" element={<AddDepartment />}></Route> */}
        {/* <Route path="/admin" element={<AdminPortal />}></Route>
        <Route path="/adminhome" element={<AdminHome />}></Route> */}
        {/* <Route path="/settings" element={<Settings />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/addDepartment" element={<AddDepartment />}></Route>
        <Route path="/facutlylist" element={<FacultyList />}></Route>
        <Route path="/editprofile" element={<ProfileEdit />}></Route>
        <Route path="/studentList" element={<StudentList />}></Route> */}
      </Routes>
      {/* <Footer /> */}
      <ToastContainer />
    </>
  );
}

export default App;
