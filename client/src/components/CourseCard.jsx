import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiBookOpen, HiUser, HiStar } from 'react-icons/hi2';
import Badge from './ui/Badge';
import Button from './ui/Button';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  if (!course) return null;

  const handleCardClick = () => {
    navigate(`/courses/${course._id}`);
  };

  const thumbnailSrc = course.thumbnail?.secure_url || course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
  const lectureCount = course.numberOfLectures || course.lectures?.length || 0;
  const authorName = course.createdBy || 'EduMaster Instructor';
  const categoryName = course.category || 'General';

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300/80 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Thumbnail Header Container */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        <img
          src={thumbnailSrc}
          alt={course.title || 'Course Thumbnail'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="indigo" size="xs">
            {categoryName}
          </Badge>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
            {course.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {course.description || 'Master key concepts with structured modules, real-world examples, and step-by-step guidance.'}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 truncate max-w-[150px]">
              <HiUser className="text-slate-400 text-sm" />
              <span className="truncate">{authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiBookOpen className="text-slate-400 text-sm" />
              <span>{lectureCount} {lectureCount === 1 ? 'Lesson' : 'Lessons'}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300"
          >
            <span>Explore Course</span>
            <HiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
