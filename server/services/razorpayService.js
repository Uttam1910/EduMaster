const razorpay = require('../config/razorpay');

const createPlan = async (planDetails) => {
  try {
    const plan = await razorpay.plans.create(planDetails);
    return plan;
  } catch (error) {
    throw error;
  }
};

const createSubscription = async (subscriptionDetails) => {
  try {
    const subscription = await razorpay.subscriptions.create(subscriptionDetails);
    return subscription;
  } catch (error) {
    throw error;
  }
};

const cancelSubscription = async (subscriptionId) => {
  try {
    const cancellation = await razorpay.subscriptions.cancel(subscriptionId);
    return cancellation;
  } catch (error) {
    throw error;
  }
};

const verifyPayment = async (paymentDetails) => {
  try {
    // Implement verification logic here
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPlan,
  createSubscription,
  cancelSubscription,
  verifyPayment,
};
