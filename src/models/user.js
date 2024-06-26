import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String, required: true, select: false
  },
  username: {
    type: String, required: true, lowercase: true, unique: true
  },
  name: {
    type: String, required: true
  },
  firstName:  {
    type: String, required: true
  },
  lastName:  {
    type: String, required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  mobileNo: {
    type: String,
    required: true
  },
  education: [{
    _id: String,
    degree: String,
    major: String,
    university: String,
    graduationYear: Number
  }],
  type: {
    type: String,
    enum: ['admin', 'user', 'reader', 'creator'],
    default: 'user',
  },
  language: {
    type: String,
    enum: ['tr', 'en'],
    default: 'en',
  },
  isPremium: {
    type: Boolean, default: false
  },
  //NOTE: You can change the gender options acc. to your needs in the app.
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  countryCode: {
    type: String,
  },
  timezone: {
    type: Number
  },
  birthDate: {
    type: Date
  },
  photoUrl: {
    type: String,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
  },
  isActivated: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    required: true
  },
  deviceId: {
    type: String,
  },
  platform: {
    type: String,
    enum: ['Android', 'IOS'],
    required: true
  },
  deletedAt: {
    type: Date
  }
},
  {
    timestamps: true
  });

const User = model('User', userSchema)
export default User
