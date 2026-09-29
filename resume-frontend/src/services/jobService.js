// import axios from "axios";

// const API_URL = "http://localhost:5000/api/jobs";

// export const getAllJobs = async (params = {}) => {
//   const token = localStorage.getItem("token");

//   const response = await axios.get(API_URL, {
//     params,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

// export const getJobById = async (id) => {
//   const token = localStorage.getItem("token");

//   const response = await axios.get(`${API_URL}/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };