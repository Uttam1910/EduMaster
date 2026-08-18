import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseUrl}/api/contact`, data);
      toast.success(response.data.message || 'Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="indigo" size="sm">Get In Touch</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-slate-600 text-base">
          Have questions or need assistance? Reach out to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errors.name && <span className="text-rose-500 text-xs font-medium">{errors.name.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                {errors.email && <span className="text-rose-500 text-xs font-medium">{errors.email.message}</span>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">Message</label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                id="message"
                rows={5}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {errors.message && <span className="text-rose-500 text-xs font-medium">{errors.message.message}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full sm:w-auto shadow-lg shadow-indigo-600/30"
            >
              Submit Message
            </Button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Contact Information</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-indigo-400 text-lg mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Address</h4>
                  <p className="text-xs text-slate-400">Bhandup West, Mumbai, Maharashtra, 400078</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaPhoneAlt className="text-indigo-400 text-lg mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-xs text-slate-400">(91) 7303896794</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaEnvelope className="text-indigo-400 text-lg mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-xs text-slate-400">r2464300@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Channels</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaTwitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaLinkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
