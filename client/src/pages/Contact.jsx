import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/contact', data);
      toast.success(response.data.message);
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center mb-16 text-indigo-800">Contact Us</h1>
      
      <div className="flex flex-col md:flex-row md:space-x-10">
        {/* Contact Form */}
        <div className="md:w-2/3 bg-white p-10 shadow-2xl rounded-lg transform transition-transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-8 text-indigo-800">Get in Touch</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
              <input
                {...register('name', { required: true })}
                type="text"
                id="name"
                className={`mt-1 block w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                id="email"
                className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700">Message</label>
              <textarea
                {...register('message', { required: true })}
                id="message"
                rows="4"
                className={`mt-1 block w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              ></textarea>
              {errors.message && <span className="text-red-500 text-sm">Message is required</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="md:w-1/3 bg-white p-10 shadow-2xl rounded-lg mt-10 md:mt-0 transform transition-transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-8 text-indigo-800">Contact Information</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">If you have any questions, feel free to reach out to us using the form or through the contact information below:</p>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800">Address:</h3>
            <p className="text-gray-600">Bhandup West, Mumbai, Maharashtra, 400078</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800">Phone:</h3>
            <p className="text-gray-600">(91) 7303896794</p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800">Email:</h3>
            <p className="text-gray-600">r2464300@gmail.com</p>
          </div>
          <div className="flex space-x-6 mt-6">
            <a href="https://facebook.com" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              <FaFacebook size={30} />
            </a>
            <a href="https://twitter.com" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              <FaTwitter size={30} />
            </a>
            <a href="https://linkedin.com" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              <FaLinkedin size={30} />
            </a>
            <a href="https://instagram.com" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              <FaInstagram size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
