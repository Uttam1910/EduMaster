import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/courses/${course._id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-2xl"
    >
      <img 
        src={course.thumbnail.secure_url} 
        alt={course.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2 text-gray-800 hover:text-indigo-600 transition duration-300">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description}
        </p>
        <div className="text-gray-800 font-bold mb-2">
          Category: <span className="text-indigo-600">{course.category}</span>
        </div>
        <button 
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 font-semibold"
        >
          Learn More <BsArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
