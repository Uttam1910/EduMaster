import React from 'react';
import Badge from '../../components/ui/Badge';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="indigo" size="sm">Legal Policy</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Terms and Conditions</h1>
        <p className="text-xs text-slate-400">Last updated: {new Date().getFullYear()}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 text-slate-700 text-sm leading-relaxed">
        <p className="text-base text-slate-800">
          Welcome to EduMaster. These Terms and Conditions outline the rules and regulations for using EduMaster's website and learning platform services.
        </p>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>By accessing or using our platform, you agree to comply with and be bound by these terms. EduMaster reserves the right to modify these terms at any time.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">2. Intellectual Property Rights</h2>
          <p>Unless otherwise stated, EduMaster owns all material on this platform. All rights are reserved for personal educational use only.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">3. User Accounts</h2>
          <p>You are responsible for maintaining confidentiality of your password and credentials. Promptly report any unauthorized access to your account.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">4. Contact Information</h2>
          <p>For questions regarding terms, contact support at <strong>r2464300@gmail.com</strong>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
