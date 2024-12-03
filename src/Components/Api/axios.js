import axios from "axios";

const axiosInstance = axios.create({
  //local instance of firebase functions
  
  // baseURL: "http://127.0.0.1:5001/clone-3ed40/us-central1/api",
  //deployed version of amazon server on render.com
  baseURL: "https://amazon-api-siz4.onrender.com",
  //deploy front end 
//  baseURL: "https://674d6c3d0f36e800083d53f6--melodic-creponne-bc0822.netlify.app/",

  // baseURL: "http://localhost:5000",
});
export { axiosInstance };
