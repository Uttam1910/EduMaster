import React from 'react';
import Badge from '../../components/ui/Badge';

const RefundsCancellations = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="amber" size="sm">Billing Policy</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Refunds and Cancellations</h1>
        <p className="text-xs text-slate-400">Last updated: {new Date().getFullYear()}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 text-slate-700 text-sm leading-relaxed">
        <p className="text-base text-slate-800">
          EduMaster aims for complete student satisfaction. Here is our refund and enrollment cancellation policy.
        </p>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">1. Refund Eligibility</h2>
          <p>Students can request a full refund within 30 days of purchasing a paid course subscription if less than 20% of modules have been completed.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">2. Processing Time</h2>
          <p>Approved refunds are processed back to original payment methods within 5–7 business days.</p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">3. Support Contact</h2>
          <p>To initiate a cancellation or refund request, reach out at <strong>r2464300@gmail.com</strong>.</p>
        </section>
      </div>
    </div>
  );
};

export default RefundsCancellations;
