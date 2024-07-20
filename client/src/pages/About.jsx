import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel CSS


const AboutUs = () => {
  const personalities = [
    {
      name: 'Albert Einstein',
      quote: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
      image: './src/assets/Images/albert.jpg', // Replace with your image path
    },
    {
      name: 'Marie Curie',
      quote: 'Nothing in life is to be feared; it is only to be understood.',
      image: './src/assets/Images/mariee.jpeg', // Replace with your image path
    },
    {
      name: 'Mahatma Gandhi',
      quote: 'Be the change that you wish to see in the world.',
      image: './src/assets/Images/mahatma.jpeg', // Replace with your image path
    },
    {
      name: 'Nelson Mandela',
      quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      image: './src/assets/Images/Mandela.jpg', // Replace with your image path
    },
    {
      name: 'Mother Teresa',
      quote: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.',
      image: './src/assets/Images/mother.jpeg', // Replace with your image path
    },
    {
      name: 'Steve Jobs',
      quote: 'The only way to do great work is to love what you do.',
      image: './src/assets/Images/jobs.jpeg', // Replace with your image path
    },
  ];

  return (

      <div className="bg-gradient-to-r from-blue-100 via-white to-blue-100 py-12 px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-center mb-8 text-gray-800">About Us</h1>
          <div className="text-center mb-12 px-4 md:px-0">
            <p className="text-xl mb-6 text-gray-700 leading-relaxed">
              Welcome to our Learning Management System! We are dedicated to providing you with the best learning experience possible. Our mission is to inspire and empower individuals through the wisdom and legacy of renowned personalities.
            </p>
            <p className="text-xl mb-6 text-gray-700 leading-relaxed">
              Our platform offers a wide range of courses and resources designed to help you achieve your personal and professional goals. Whether you're looking to develop new skills, advance your career, or simply learn something new, we have something for everyone.
            </p>
            <p className="text-xl mb-6 text-gray-700 leading-relaxed">
              Join us on this journey of continuous learning and growth. Together, we can unlock your full potential and make a positive impact in the world.
            </p>
          </div>
          <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            interval={3000}
            showThumbs={false}
            showStatus={false}
            className="mb-12"
          >
            {personalities.map((person, index) => (
              <div key={index} className="flex flex-col items-center p-8 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
                <div className="w-48 h-48 mb-6 rounded-full overflow-hidden">
                  {person.image ? (
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800">{person.name}</h2>
                <p className="text-lg italic mt-4 text-center text-gray-600">"{person.quote}"</p>
              </div>
            ))}
          </Carousel>
          <div className="text-center px-4 md:px-0">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At our Learning Management System, we believe in the power of education to transform lives. We are committed to creating a supportive and inclusive learning environment where everyone can thrive. Our core values include:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-8 mx-auto max-w-lg text-left">
              <li>Excellence in education</li>
              <li>Continuous improvement</li>
              <li>Inclusivity and diversity</li>
              <li>Empowerment through knowledge</li>
              <li>Collaboration and community</li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              We invite you to explore our courses and join our community of learners. Together, we can achieve great things and make a lasting impact on the world.
            </p>
          </div>
        </div>
      </div>

  );
};

export default AboutUs;
