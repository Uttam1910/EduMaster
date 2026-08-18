import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HiHome } from 'react-icons/hi2';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 tracking-widest">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
          className="shadow-lg shadow-indigo-600/30"
          icon={HiHome}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
