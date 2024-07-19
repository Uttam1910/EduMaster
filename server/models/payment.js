const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayPaymentId: { type: String, required: true },
  razorpaySubscriptionId: { type: String, required: true },
  razorpaySignature: { type: String, required: true },
  planId: { type: String, required: true },
  status: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
    