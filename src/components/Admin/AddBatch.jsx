import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBatch = () => {
  const [formData, setFormData] = useState({
    batch_name: "",
    course: "",
    start_year: "",
    end_year: "",
  });
  const [courses, setCourses] = useState([]); // Ensuring courses is always an array
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchCourses = async () => {
    //   try {
    //     const response = await axios.get("/api/courses-list/");
        
    //     if (Array.isArray(response.data)) {
    //       setCourses(response.data); // Ensure response is an array
    //     } else {
    //       setCourses([]); // Fallback to an empty array
    //       toast.error("Invalid data format received for courses.");
    //     }

    //   } catch (error) {
    //     setCourses([]); // Prevent undefined issues
    //     toast.error("Failed to fetch courses.");
    //     console.error("Error fetching courses:", error);
    //   }
    // };
    // fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.start_year > formData.end_year) {
      toast.error("Start year cannot be after end year.");
      setIsLoading(false);
      return;
    }

    try {
     const response = await axios.post("/api/batches/", formData);
     console.log(response.data);
     
      toast.success("Batch added successfully!");
      setFormData({ batch_name: "", course: "", start_year: "", end_year: "" });
      setTimeout(() => navigate("/batches"), 2000);
    } catch (error) {
      toast.error("Failed to add batch. Please check the inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Batch</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Batch Name:</label>
          <input
            type="text"
            name="batch_name"
            value={formData.batch_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Course:</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Course</option>
            
                <option >
                B Tech
                </option>
                <option >
                  M Tech
                </option>
              
          
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Year:</label>
          <input
            type="number"
            name="start_year"
            value={formData.start_year}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Year:</label>
          <input
            type="number"
            name="end_year"
            value={formData.end_year}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Add Batch"}
        </button>
      </form>
    </div>
  );
};

export default AddBatch;
