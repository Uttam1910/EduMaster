const User = require('../models/user');
const Payment = require('../models/payment');
const razorpayService = require('../services/razorpayService');

// Get Razorpay Key
const getRazorpayKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

const subscribe = async (req, res) => {
  try {
    const { planDetails, subscriptionDetails, userId } = req.body;
    const plan = await razorpayService.createPlan(planDetails);
    subscriptionDetails.plan_id = plan.id;
    const subscription = await razorpayService.createSubscription(subscriptionDetails);

    const payment = new Payment({
      userId,
      razorpayPaymentId: subscription.id,
      razorpaySubscriptionId: subscription.id,
      razorpaySignature: '', // Update with actual signature from Razorpay webhook
      planId: plan.id,
      status: subscription.status,
      startDate: new Date(subscription.current_start * 1000),
      endDate: new Date(subscription.current_end * 1000),
    });
    await payment.save();

    const user = await User.findById(userId);
    user.subscription = {
      paymentId: payment._id,
      status: subscription.status,
      startDate: new Date(subscription.current_start * 1000),
      endDate: new Date(subscription.current_end * 1000),
    };
    await user.save();

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const cancellation = await razorpayService.cancelSubscription(subscriptionId);

    const payment = await Payment.findOne({ razorpaySubscriptionId: subscriptionId });
    payment.status = 'cancelled';
    await payment.save();

    const user = await User.findById(payment.userId);
    user.subscription.status = 'cancelled';
    await user.save();

    res.status(200).json(cancellation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verify = async (req, res) => {
  try {
    const paymentDetails = req.body;
    const verification = await razorpayService.verifyPayment(paymentDetails);

    const payment = await Payment.findOne({ razorpayPaymentId: paymentDetails.razorpay_payment_id });
    payment.status = verification.status;
    await payment.save();

    res.status(200).json(verification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRazorpayKey,
  subscribe,
  unsubscribe,
  verify,
  getAllPayments,
};
