import axios from "axios";

const API = axios.create({
  baseURL: "10.70.61.140/api", // Replace with your laptop ip or backend base url
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
