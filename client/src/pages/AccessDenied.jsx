// src/pages/AccessDenied.jsx
import React from 'react';

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Access Denied</h2>
        <p className="text-gray-600 text-center">You are not authorized to access this page.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
