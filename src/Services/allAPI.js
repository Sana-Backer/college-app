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
    const response = await axios.post(`${serverUrl}/token/refresh/`, {
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
export const loginApi = async (userDetails) => {
  console.log("Sending API request:", userDetails); // Debugging log

  return await commonAPI("POST", `${serverUrl}/login/`, userDetails, {
    "Content-Type": "application/json",  // Ensure JSON request
  });
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

export const getStudentApi = async (id, token, isStudent) => {
  const url = isStudent ? `${serverUrl}/stlist/` : `${serverUrl}/stlist/${id}`;
  return await commonAPI("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });
};


//delete student api
export const deleteStudentApi = async (student_id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/stlist/${student_id}/`, "", {
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
    "PUT", `${serverUrl}/departments/${id}/`, deptdetails,
    {
      Authorization: `Bearer ${token}`,
    }
  );
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
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching faculty data", error);
    throw error;
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
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// faculty list
export const FacultyApi = async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    throw new Error("Token is missing");
  }
  return await commonAPI("GET", `${serverUrl}/falist/`, null, {
    Authorization: `Bearer ${token}`,
  });
};

// profile
export const getUserProfileApi = async (userId, token) => {
  return axios.get(`http://localhost:8000/api/profile/${userId}/`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
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
    throw err;
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

export const getNotesByFcaulty = async (token, facultyId) => {
  try {
    const response = await axios.get(`${serverUrl}/notes/faculty/${facultyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};
// student note by course
export const getStudentNotesByCourse = async (courseId, token) => {
  try {
    const response = await axios.get(`${serverUrl}/notes/course/${courseId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student notes:', error);
    throw error;
  }
};

//delete_Studentnote
export const delete_Studentnote = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notes/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

// Delete note data
export const deleteNoteApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notes/${id}/`, null, {
    Authorization: `Bearer ${token}`,
  });
}

// ---------------------notifications


export const getNotificationsApi = async (token) => {
  try {
    const response = await commonAPI("GET", `${serverUrl}/notifications/`, null, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.error("Invalid response data:", response.data);
      return [];
    }

    return response.data.filter(notification => notification.is_student === true);
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return []; // Return an empty array to avoid breaking `.map()` in React
  }
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

export const deleteNotificationApi = async (notificationId, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notifications/${notificationId}/`, null, {
    Authorization: `Bearer ${token}`
  });
};

export const sendNotificationtoFacApi = async (data, token) => {
  const requestData = {
    ...data,  // Spread existing data
    is_student: false, // Explicitly set is_student to false
  };

  return await commonAPI("POST", `${serverUrl}/notifications/`, requestData, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });
};

export const getNotificationsbyHodApi = async (token) => {
  try {
    const response = await commonAPI("GET", `${serverUrl}/notifications/`, null, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    // ✅ Filter notifications where `is_student` is `false`
    return response.data.filter(notification => notification.is_student === false);
    
  } catch (error) {
    console.error("Error fetching HOD notifications:", error);
    throw error;
  }
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
// Get all batches
export const getBatchApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/batches/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// Edit batch
export const editBatchApi = async (batchId, token, batchData) => {
  return await commonAPI("PUT", `${serverUrl}/batches/${batchId}/`, batchData, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });
};

// Delete batch
export const deleteBatchApi = async (batchId, token) => {
  return await commonAPI("DELETE", `${serverUrl}/batches/${batchId}/`, {}, {
    Authorization: `Bearer ${token}`
  });
};



// ---------------------COURSE
// -----------------------------------------------------------------
export const addCourseApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/courses-list/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};

// all courses
export const getCoursesApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/courses-list/`, "",
    {
      Authorization: `Bearer ${token}`
    }
  )
}
// Edit Course API
export const editCourseApi = async (courseId, token, courseData) => {
  return await commonAPI("PUT", `${serverUrl}/courses/${courseId}/`, courseData, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });
};

// Delete Course API
export const deleteCourseApi = async (courseId, token) => {
  try {
    const response = await commonAPI(
      "DELETE",
      `${serverUrl}/courses/${courseId}/`,  // ✅ Ensure trailing slash
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
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
export const editSubjectApi = async (subjectid, token, subjectData) => {
  return await commonAPI("PUT", `${serverUrl}/subjects/${subjectid}/`, subjectData, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });
};


export const deleteSubjectApi = async (subjectId, token) => {
  return await commonAPI("DELETE", `${serverUrl}/subjects/${subjectId}/`, null, {
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
export const getAssignmentsByBatch = async (token, batchId) => {
  return await axios.get(`${serverUrl}/student/assignments/${batchId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// get assignment submission
export const getAssignmentSubmissions = async (token, assignmentId) => {
  return await axios.get(`${serverUrl}/assignments/${assignmentId}/submissions/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// edit assignments
export const editAssignmentApi = async (id, assignD, token) => {
  return await commonAPI("PUT", `${serverUrl}/assignments/${id}/`, assignD, {
    Authorization: `Bearer ${token}`,
  });
};

// Delete a specific submission
export const deleteSubmissionApi = async (token, assignmentId, submissionId) => {
  return await commonAPI("DELETE", `${serverUrl}/assignments/${assignmentId}/submissions/${submissionId}/`, null, {
    Authorization: ` Bearer ${token}`
  });
};

// delete assignment
export const deleteAssignmentApi = async (token, id) => {  // ✅ Corrected order
  return await commonAPI("DELETE", `${serverUrl}/assignments/${id}/`, null, {
    Authorization: `Bearer ${token}`
  });
};


// Get submissions for a specific assignment
export const getSubmissionsApi = async (token, assignmentId) => {
  return await commonAPI("GET", `${serverUrl}/assignments/${assignmentId}/submissions/`, null, {
    Authorization: ` Bearer ${token}`
  });
};

// Create a new submission for a specific assignment
export const createSubmissionApi = async (token, assignmentId, submissionData) => {
  return await commonAPI("POST", `${serverUrl}/assignments/${assignmentId}/submissions/`, submissionData, {
    Authorization: `Bearer ${token}`
  });
};




// Create student attendance
export const createStudentAttendanceApi = async (data,token) => {
  return await commonAPI(
    "POST",
    `${serverUrl}/student_attendance/`, // Correct template literal
    JSON.stringify(data),               // Ensure JSON is stringified
    {
      Authorization: `Bearer ${token}`, // Correct template literal
      "Content-Type": "application/json",
    }
  );
};

export const getStudentAttendenceApi = async (filters) => {
    try {
        const response = await axios.get(`${serverUrl}/student_attendance/`, {
            params: filters,  // Send filters as query params
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAttendanceToStudentApi = async (userId, token) => {
  try {
      const response = await commonAPI("GET", `${serverUrl}/student_attendance/${userId}/`, null, {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      });

      console.log("API Response:", response.data); // Debugging log
      return response.data; // ✅ Extract only the data array
  } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      return []; // ✅ Return empty array instead of `{ data: [] }`
  }
};



// fac attendance
export const getFacultyAttendanceRecords = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/faculty-attendance/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty attendance records:", error);
    throw error;
  }
};




export const createFacultyAttendanceApi = async (data, token) => {
  try {
      console.log("📤 Sending Request Data:", data);  // Debugging log
      const response = await axios.post(
          `${serverUrl}/faculty-attendance/`,
          data,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          }
      );
      return response;
  } catch (error) {
      console.error("🚨 API Error Response:", error.response?.data || error);
      throw error;
  }
};
export const deleteFacultyAttendenceApi = async (token, id) => {

  try {
    const response = await axios.delete(`${serverUrl}/faculty-attendance/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting attendance  report:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// ------------result
// post
export const uploadExamResultApi = async (token, title, file) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  return await commonAPI("POST", ` ${serverUrl}/exam_result/`, formData, {
    Authorization: `Bearer ${token}`,
  });
};

// Post exam result data
export const ExamResultApi = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/exam_result/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exam results!', error);
    throw error;
  }
};
// delete
export const deleteExamResultApi = async (token, id) => {

  try {
    const response = await axios.delete(`${serverUrl}/exam_result/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting exam result:", error.response ? error.response.data : error.message);
    throw error;
  }
};