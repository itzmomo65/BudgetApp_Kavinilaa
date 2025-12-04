import axios from "axios";

const API_URL = "http://localhost:9090/api/users";

class UserService {
  getProfile(username) {
    return axios.get(`${API_URL}/${username}`);
  }

  updateProfile(username, data) {
    return axios.put(`${API_URL}/${username}`, data);
  }

  uploadProfileImage(username, formData) {
    return axios.post(`${API_URL}/${username}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  deleteProfileImage(username) {
    return axios.delete(`${API_URL}/${username}/delete-image`);
  }
}

export default new UserService();
