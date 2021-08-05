import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FollowSchema = new Schema({

  _id: {
    type: String,
    trim: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }

});

const Follow = mongoose.model('Follow', FollowSchema);
export default Follow;
