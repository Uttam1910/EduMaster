// RefundsCancellations.jsx
import React from 'react';

const RefundsCancellations = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Refunds and Cancellations</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Thank you for purchasing our courses at EduMaster. We strive to ensure that our customers are satisfied with their learning experience. If, for any reason, you are not entirely satisfied with your purchase, we are here to help.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
        <p>
          To be eligible for a refund, you must meet the following criteria:
        </p>
        <ul className="list-disc list-inside ml-4 mt-4 space-y-2">
          <li>You must request the refund within 30 days of your purchase.</li>
          <li>You have not completed more than 20% of the course.</li>
          <li>You have not downloaded any materials from the course.</li>
          <li>You provide a valid reason for requesting the refund, such as technical issues or dissatisfaction with the course content.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Items</h2>
        <p>
          Certain items are non-refundable, including but not limited to:
        </p>
        <ul className="list-disc list-inside ml-4 mt-4 space-y-2">
          <li>Completed courses</li>
          <li>Downloadable software products</li>
          <li>Services that have already been provided</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Refund Process</h2>
        <p>
          To request a refund, please contact us at <a href="mailto:r2464300@gmail.com" className="text-blue-500 underline">r2464300@gmail.com</a> with your order details and the reason for the refund request. Our team will review your request and notify you of the approval or rejection of your refund.
        </p>
        <p className="mt-4">
          If your refund is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain number of days, depending on your card issuer's policies.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Cancellations</h2>
        <p>
          You may cancel your subscription at any time. However, please note that canceling your subscription does not automatically result in a refund. If you wish to request a refund along with your cancellation, please refer to our refund eligibility criteria above.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about our Refunds and Cancellations Policy, please contact us:
        </p>
        <ul className="list-disc list-inside ml-4 mt-4 space-y-2">
          <li>EduMaster</li>
          <li>Email: <a href="mailto:r2464300@gmail.com" className="text-blue-500 underline">r2464300@gmail.com</a></li>
          <li>Phone: (91) 7303896794</li>
          <li>Address: Gao Devi Road, Mumbai, Maharashtra, 400078</li>
        </ul>
      </section>
    </div>
  );
};

export default RefundsCancellations;
