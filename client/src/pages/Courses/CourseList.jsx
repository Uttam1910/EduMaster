import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../redux/slice/courseSlice';
import CourseCard from '../../components/CourseCard';

const CourseList = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const loading = useSelector((state) => state.courses.loading);
  const error = useSelector((state) => state.courses.error);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-800">Our Courses</h1>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600"></div>
          <span className="ml-2 text-indigo-600 text-lg">Loading...</span>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500 text-lg">Error: {error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseList;

