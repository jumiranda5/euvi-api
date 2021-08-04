import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isPrivate:{
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  searchKeys: []
});

UserSchema.set('timestamps', true);

const User = mongoose.model('User', UserSchema);
export default User;
