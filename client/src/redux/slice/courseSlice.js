// redux/slice/courseSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';

// Fetch all courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const response = await axiosInstance.get('/courses');
  return response.data;
});

// Fetch course by ID with public access fallback
export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (courseId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // If unauthorized, try fetching public course details
      try {
        const response = await axiosInstance.get(`/courses/public/${courseId}`);
        return response.data;
      } catch (publicError) {
        return rejectWithValue(publicError.response?.data || publicError.message);
      }
    }
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Create a new course
export const createCourse = createAsyncThunk('courses/createCourse', async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/courses/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.course;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete a course
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (courseId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/courses/${courseId}`);
    return response.data.message;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    course: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((course) => course._id !== action.meta.arg);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
