import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';

// Fetch all courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const response = await axiosInstance.get('/courses');
  return response.data;
});

// Fetch enrolled courses with progress metadata
export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/courses/enrolled');
      return response.data.enrolledCourses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch course by ID
export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (courseId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch course progress for current user
export const fetchCourseProgress = createAsyncThunk(
  'courses/fetchCourseProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/progress`);
      return response.data.progress;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Toggle/set lecture completion
export const toggleLectureCompletion = createAsyncThunk(
  'courses/toggleLectureCompletion',
  async ({ courseId, lectureId, markComplete }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/courses/${courseId}/lectures/${lectureId}/complete`,
        { markComplete }
      );
      return response.data.progress;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Record last watched lecture position & playback time
export const recordLastWatched = createAsyncThunk(
  'courses/recordLastWatched',
  async ({ courseId, lectureId, lastPlaybackTime }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/courses/${courseId}/lectures/${lectureId}/last-watched`,
        { lastPlaybackTime }
      );
      return response.data.progress;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
    enrolledCourses: [],
    course: null,
    progress: null,
    loading: false,
    enrolledLoading: false,
    progressLoading: false,
    error: null,
  },
  reducers: {
    clearCourseProgress: (state) => {
      state.progress = null;
    },
  },
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
      // Enrolled courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.enrolledLoading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledLoading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.enrolledLoading = false;
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
      // Progress thunks
      .addCase(fetchCourseProgress.pending, (state) => {
        state.progressLoading = true;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.progressLoading = false;
        state.progress = action.payload;
      })
      .addCase(fetchCourseProgress.rejected, (state) => {
        state.progressLoading = false;
      })
      .addCase(toggleLectureCompletion.pending, (state) => {
        state.progressLoading = true;
      })
      .addCase(toggleLectureCompletion.fulfilled, (state, action) => {
        state.progressLoading = false;
        state.progress = action.payload;
      })
      .addCase(toggleLectureCompletion.rejected, (state) => {
        state.progressLoading = false;
      })
      .addCase(recordLastWatched.fulfilled, (state, action) => {
        if (state.progress && action.payload) {
          state.progress.lastWatchedLecture = action.payload.lastWatchedLecture;
          state.progress.lastPlaybackTime = action.payload.lastPlaybackTime;
        }
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
        state.courses = state.courses.filter((c) => c._id !== action.meta.arg);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourseProgress } = courseSlice.actions;
export default courseSlice.reducer;
