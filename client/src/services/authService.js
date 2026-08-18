import axios from 'axios';

const BASE_HOST = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_HOST}/api/users/`;

export const forgotPassword = (email) => {
  return axios.post(`${API_URL}forgotpassword`, { email });
};

export const resetPassword = (token, password) => {
  return axios.put(`${API_URL}resetpassword/${token}`, { password });
};
