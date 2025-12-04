import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9090", // your backend URL
});

export default API;
