const { Schema, model } = require('mongoose');

const progressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    lastWatchedLecture: {
      type: Schema.Types.ObjectId,
    },
    lastPlaybackTime: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one progress document per (user, course) pair
progressSchema.index({ user: 1, course: 1 }, { unique: true });

const Progress = model('Progress', progressSchema);

module.exports = Progress;
