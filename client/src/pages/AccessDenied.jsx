import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HiShieldExclamation } from 'react-icons/hi2';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center text-5xl mx-auto border border-rose-500/20">
          <HiShieldExclamation />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Access Denied</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          You do not have administrative permission to view this page or resource. Please sign in with an authorized account.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="md" onClick={() => navigate(-1)} className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
            Go Back
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/')}>
            Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
