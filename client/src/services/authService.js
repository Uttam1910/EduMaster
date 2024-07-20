import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

export const forgotPassword = (email) => {
  return axios.post(`${API_URL}forgotpassword`, { email });
};

export const resetPassword = (token, password) => {
  return axios.put(`${API_URL}resetpassword/${token}`, { password });
};
