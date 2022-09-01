import axios from "axios";

//used to import http method
export default axios.create({
  baseURL: "http://localhost:5000/api/v1/restaurant",
  headers: {
    "Content-type": "application/json"
  }
});

