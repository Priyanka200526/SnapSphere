// models/StoryView.js
import mongoose from 'mongoose';

const storyViewSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

storyViewSchema.index({ storyId: 1, viewerId: 1 }, { unique: true });

const StoryviewModel = mongoose.model('StoryView', storyViewSchema);

export default StoryviewModel;