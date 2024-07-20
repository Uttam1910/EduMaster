// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import courseReducer from './slice/courseSlice';
import userReducer from './slice/userSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    user: userReducer,
  },
});

export default store;
