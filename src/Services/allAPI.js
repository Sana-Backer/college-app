import axios from "axios";
import { commonAPI } from "./commonApi";
import { serverUrl } from "./serverUrl";


// Function to refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh'); // Assume the refresh token is also stored
  if (!refreshToken) {
    throw new Error('No refresh token found in localStorage');
  }

  try {
    const response = await axios.post(`${serverUrl}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;
    localStorage.setItem('access', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error.response || error.message);
    throw error;
  }
};

// Login API
export const loginApi = async (userDetails) => {
  return await commonAPI("POST", `${serverUrl}/login/`, userDetails, "");
};

// Register API
export const registerApi = async (userDetails) => {
  return await commonAPI("POST", `${serverUrl}/register/`, userDetails, "");
};

// OTP Verification API
export const verifyOtpApi = async (otpDetails) => {
  return await commonAPI("POST", `${serverUrl}/verify_otp/`, otpDetails, "");
};

// Resend OTP API
export const resendOtpApi = async (userDetails) => {
  return await commonAPI("POST", `${serverUrl}/resend_otp/`, userDetails, "");
};
// =====================================================================================================

export const StudentApi = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/stlist/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include your token here
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token expired, refreshing token...');
      try {
        const newToken = await refreshToken();
        const response = await axios.get(`${serverUrl}/stlist/`, {
          headers: {
            Authorization: `Bearer ${newToken}`, // Use the new token
          },
        });
        return response;
      } catch (refreshError) {
        console.error('Error fetching students after token refresh:', refreshError);
        throw refreshError;
      }
    } else {
      console.error('Error fetching students:', error.response || error.message);
      throw error;
    }
  }
};

// // studentlist -api
// export const StudentApi = async () => {
//   return await commonAPI("GET", `${serverUrl}/stlist/`, "", "");
// };


//addStudentApi
export const addStudentApi = async (formData, reqHeader) => {
  try {
    const response = await axios.post(`${serverUrl}/stlist/`, formData, {
      headers: {
        ...reqHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.error("Error in addStudentApi:", err.response || err.message);
    throw err; // Let the calling function handle errors
  }
};

export const getStudentApi = async (token, userId) => {
  return await commonAPI("GET", `${serverUrl}/stlist/${userId}`, null, {
    Authorization: `Bearer ${token}`,
  });
};

//delete student api
export const deleteStudentApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/stlist/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

//editstudentapi
export const editStdApi = async (id, studentdetails, token) => {
  return await commonAPI("PUT", `${serverUrl}/stlist/${id}/`, studentdetails, {
    Authorization: `Bearer ${token}`,
  });
};


// ======================================================================================

// department list
export const getDepartmentsApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/departments/`, null, {
    Authorization: `Bearer ${token}`,
  });
};


// Department API functions
export const addDepartmentApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/departments/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  });
};

//delete department

export const deleteDeptApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/departments/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

//edit department
export const editDeptApi = async (id, deptdetails, token) => {
  return await commonAPI(
    "PUT",
    `${serverUrl}/departments/${id}/`,
    deptdetails,
    {
      Authorization: `Bearer ${token}`,
    }
  ); m
};
// dept view
export const departmentApi = async () => {
  return await commonAPI("GET", `${serverUrl}/departments-list/`, "", "");
};

// ================================================================


// HOD API functions
export const HodApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/hodlist/`, null, {
    Authorization: `Bearer ${token}`,
  });
};

export const deleteHodApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/hodlist/${id}/`, null, {
    Authorization: `Bearer ${token}`,
  });
};

export const editHodApi = async (id, hodDetails, token) => {
  return await commonAPI("PUT", `${serverUrl}/hodlist/${id}/`, hodDetails, {
    Authorization: `Bearer ${token}`,
  });
};

// faculty
//Addfacultyapi
export const addFacultyApi = async (formData, reqHeader) => {
  try {
    const response = await axios.post(`${serverUrl}/Faculty/`, formData, {
      headers: {
        ...reqHeader, // Include authorization and other necessary headers
        "Content-Type": "multipart/form-data", // Ensure this matches backend expectations
      },
    });
    return response;
  } catch (err) {
    console.error("Error in addFacultyApi:", err.response || err.message);
    throw err; // Let the calling function handle errors
  }
};

// faculty list
export const facultyApi = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/falist/`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        // Pass token in Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching faculty data", error);
    throw error; // Rethrow error for proper handling in the component
  }
};

//delete faculty
export const deleteFacultyApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/falist/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

//edit faculty
export const editFacultyApi = async (id, facultydetails, token) => {
  return await commonAPI("PUT", `${serverUrl}/falist/${id}/`, facultydetails, {
    Authorization: `Bearer ${token}`,
  });
};

// faculty list
export const FacultyApi = async () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("access");

  // Check if token is available
  if (!token) {
    throw new Error("Token is missing");
  }

  // Make API call using commonAPI function
  return await commonAPI("GET", `${serverUrl}/falist/`, null, {
    Authorization: `Bearer ${token}`,
  });
};


//faculty dash

//student_attendanceapi
export const student_attendanceapi = async (token) => {
  return await commonAPI(
    "GET",
    `${serverUrl}/student_attendance/${id}/`,
    studentdetails,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

//uploading notes {faculty dash}

// export const upload_Studentnote = async (formData, reqHeader) => {
//   try {
//     const response = await axios.post(`${serverUrl}/notes/`, formData, {
//       headers: {
//         ...reqHeader,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response;
//   } catch (err) {
//     console.error("Error in upload_Studentnote:", err.response || err.message);
//     throw err; // Re-throw to let the caller handle it
//   }
// };




export const upload_Studentnote = async (formData, reqHeader) => {
  try {
    const response = await axios.post(`${serverUrl}/notes/`, formData, {
      headers: {
        ...reqHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.error("Error in upload_Studentnote:", err.response || err.message);
    throw err; // Re-throw to let the caller handle it
  }
};

export const getNotes = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/notes/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

//delete_Studentnote
export const delete_Studentnote = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notes/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};


// -----------------------------------------------------------------
export const addCourseApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/courses-list/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};



// profile
export const getUserProfileApi = async (userId, token) => {
  return axios.get(`http://localhost:8000/api/profile/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ---------------------notifications

export const getNotificationsApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/notifications/view/`, null, {
    Authorization: `Bearer ${token}`
  });
};

export const getNotificationByIdApi = async (userId, token) => {
  return await commonAPI("GET", `${serverUrl}/notifications/${userId}/`, null, {
    Authorization: `Bearer ${token}`
  });
};

export const addNotificationApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/notifications/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};

export const updateNotificationApi = async (id, data, token) => {
  return await commonAPI("PUT", `${serverUrl}/notifications/${id}/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};

export const deleteNotificationApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notifications/${id}/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// --------------------Batch

// add batch

export const addbatchApi = async (formData, token) => {
  return await commonAPI("POST", `${serverUrl}/batches/`, formData, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};
// 
export const getBatchApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/batches/`, null, {
    Authorization: `Bearer ${token}`
  });
};
// ---------------------COURSE
// all courses
export const getCoursesApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/courses-list/`, "")
}
// ---------------------subject

// add subject
export const addSubjectApi = async (token, subjectData) => {
  return axios.post(`${serverUrl}/subjects/`, subjectData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// get subject
export const getSubjectApi = async (token, subjectData) => {
  return await commonAPI("GET", `${serverUrl}/subjects/`, subjectData, {
    Authorization: `Bearer ${token}`
  });
};
// ----------------------Assignment

export const addAssignmentApi = async (token, assignmentData) => {
  return axios.post(`${serverUrl}/assignments/`, assignmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// get assignment
export const getAssignmentApi = async (token, assignmentData) => {
  return await commonAPI("GET", `${serverUrl}/assignments/`, assignmentData, {
    Authorization: `Bearer ${token}`
  });
};

// edit assignments
export const editAssignmentApi = async (id, assignD, token) => {
  return await commonAPI("PUT", `${serverUrl}/assignments/${id}/`, assignD, {
    Authorization: `Bearer ${token}`,
  });
};

// delete assignment
export const deleteAssignmentApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/assignments/${id}/`, null, {
    Authorization: `Bearer ${token}`
  });
};






