import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CourseCard from '../../src/components/CourseCard'; // Import the CourseCard component
import { FaChalkboardTeacher, FaLaptopCode, FaCertificate, FaUsers, FaMobileAlt, FaBookOpen } from 'react-icons/fa'; // Import icons
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { logoutUser, logout } from '../redux/slice/authSlice';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/courses`);
        console.log('API Response:', response.data); // Debug log
        if (response.data && Array.isArray(response.data)) {
          setPopularCourses(response.data.slice(0, 3));
        } else {
          console.warn('Unexpected API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching popular courses:', error.message);
        console.error('Error details:', error.response);
        // Fallback to mock data for testing
        const mockCourses = [
          {
            _id: '1',
            title: 'Course 1',
            description: 'Description for Course 1',
            thumbnail: { secure_url: 'https://via.placeholder.com/150' },
          },
          {
            _id: '2',
            title: 'Course 2',
            description: 'Description for Course 2',
            thumbnail: { secure_url: 'https://via.placeholder.com/150' },
          },
          {
            _id: '3',
            title: 'Course 3',
            description: 'Description for Course 3',
            thumbnail: { secure_url: 'https://via.placeholder.com/150' },
          },
        ];
        setPopularCourses(mockCourses);
      }
    };

    fetchPopularCourses();
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/');
  };

  const testimonials = [
    { name: 'Ravi Kumar', testimonial: 'This platform has transformed my learning experience. Highly recommend!' },
    { name: 'Aditi Sharma', testimonial: 'The courses are well-structured and the instructors are very knowledgeable.' },
    { name: 'Rajesh Singh', testimonial: 'I love the interactive nature of the courses. It keeps me engaged.' },
    { name: 'Priya Verma', testimonial: 'The flexibility of learning at my own pace is invaluable.' },
    { name: 'Neha Agarwal', testimonial: 'Fantastic learning experience with great support from instructors.' },
    { name: 'Arjun Patil', testimonial: 'The certifications have boosted my career prospects significantly.' },
    { name: 'Kavya Rao', testimonial: 'The community support is amazing. I never feel alone in my learning journey.' },
    { name: 'Aniket Joshi', testimonial: 'The resources provided are comprehensive and very helpful.' },
    { name: 'Sneha Pillai', testimonial: 'Learning on the go with their mobile app is super convenient.' },
    { name: 'Vikram Choudhary', testimonial: 'The instructors are industry experts and very approachable.' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="space-y-16 text-white">
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Learning Management System</h1>
          <p className="text-xl mb-8">Your gateway to world-class education and training.</p>
          {!isLoggedIn ? (
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
          ) : (
            <div>
              <button className="btn btn-primary mr-4" onClick={() => navigate('/Courses')}>Explore Courses</button>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <FaChalkboardTeacher className="text-4xl mb-4 mx-auto text-yellow-500" />
            <h3 className="text-xl font-bold mb-4">Expert Instructors</h3>
            <p>Learn from industry experts with years of experience.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <FaLaptopCode className="text-4xl mb-4 mx-auto text-blue-500" />
            <h3 className="text-xl font-bold mb-4">Interactive Courses</h3>
            <p>Engage in interactive and practical courses designed for real-world application.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <FaCertificate className="text-4xl mb-4 mx-auto text-green-500" />
            <h3 className="text-xl font-bold mb-4">Certification</h3>
            <p>Receive certificates upon completion of courses to boost your career.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <FaUsers className="text-4xl mb-4 mx-auto text-pink-500" />
            <h3 className="text-xl font-bold mb-4">Community Support</h3>
            <p>Join a vibrant community of learners and educators.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <FaMobileAlt className="text-4xl mb-4 mx-auto text-purple-500" />
            <h3 className="text-xl font-bold mb-4">Mobile Learning</h3>
            <p>Access our courses on the go, anytime and anywhere.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <FaBookOpen className="text-4xl mb-4 mx-auto text-red-500" />
            <h3 className="text-xl font-bold mb-4">Extensive Resources</h3>
            <p>Utilize a wide range of resources to enhance your learning.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.length > 0 ? (
              popularCourses.map(course => (
                <CourseCard key={course._id} course={course} /> // Use CourseCard component
              ))
            ) : (
              <p className="text-center text-white">No courses available.</p>
            )}
          </div>
          <div className="text-center mt-8">
            <button className="btn btn-secondary" onClick={() => navigate('/courses')}>
              View All Courses
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16 px-4">
  <h2 className="text-3xl font-bold text-center mb-12 text-black">What Our Students Say</h2>
  <Slider {...settings}>
    {testimonials.map((testimonial, index) => (
      <div key={index} className="p-4 sm:p-6">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center">
          <p className="mb-4">"{testimonial.testimonial}"</p>
          <p className="font-bold">- {testimonial.name}</p>
        </div>
      </div>
    ))}
  </Slider>
</section>


      <section className="bg-gray-900 py-16 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Join Us Today</h2>
          <p className="text-xl mb-8">Become a part of our thriving community of learners.</p>
          {!isLoggedIn ? (
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
          ) : (
            <div>
              <button className="btn btn-primary mr-4" onClick={() => navigate('/Courses')}>Explore Courses</button>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
