import React from 'react';
import Badge from '../../components/ui/Badge';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="emerald" size="sm">Privacy Policy</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: {new Date().getFullYear()}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 text-slate-700 text-sm leading-relaxed">
        <p className="text-base text-slate-800">
          Your privacy is important to us. This Privacy Policy describes how EduMaster collects, uses, and safeguards user information.
        </p>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">1. Information Collection</h2>
          <p>We collect essential user account information (username, email) required for course progress tracking and secure authentication.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">2. Data Security</h2>
          <p>We implement industry-standard encryption, JWT token management, and secure media storage protocols to safeguard your personal details.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">3. Contact Us</h2>
          <p>If you have any questions regarding privacy data, email <strong>r2464300@gmail.com</strong>.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
