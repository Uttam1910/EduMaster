import axios from 'axios';

const API_URL = 'https://edumaster-5vk1.onrender.com/api/users/';

export const forgotPassword = (email) => {
  return axios.post(`${API_URL}forgotpassword`, { email });
};

export const resetPassword = (token, password) => {
  return axios.put(`${API_URL}resetpassword/${token}`, { password });
};
