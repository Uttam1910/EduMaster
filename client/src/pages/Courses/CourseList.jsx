import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../redux/slice/courseSlice';
import CourseCard from '../../components/CourseCard';
import CardSkeleton from '../../components/ui/CardSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import { HiMagnifyingGlass, HiXMark, HiAdjustmentsHorizontal } from 'react-icons/hi2';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return ['All'];
    const unique = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));
    return ['All', ...unique];
  }, [courses]);

  // Filter courses based on search term and category
  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    return courses.filter((course) => {
      const matchesSearch =
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <Badge variant="indigo" size="sm">Course Catalog</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore All Courses</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Gain in-demand technical skills with expert-crafted modules, video lessons, and practical exercises.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-xs text-slate-200">
          <HiAdjustmentsHorizontal className="text-indigo-400 text-lg" />
          <span>{filteredCourses.length} Courses Available</span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Bar Input */}
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by course title, topic, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <HiXMark className="text-lg" />
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Course List Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardSkeleton count={6} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Courses"
          message={typeof error === 'string' ? error : error?.message || 'Unable to connect to course server.'}
          onRetry={() => dispatch(fetchCourses())}
        />
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Courses Match Your Criteria"
          description={
            searchTerm || selectedCategory !== 'All'
              ? 'Try searching with a different keyword or resetting your category filter.'
              : 'No courses have been published yet.'
          }
          actionLabel={searchTerm || selectedCategory !== 'All' ? 'Clear Filters' : undefined}
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
};

export default CourseList;
