import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', "editor"], required: true },
  profile_image: { type: String }
});

const User = mongoose.model('User', userSchema);

export default User;