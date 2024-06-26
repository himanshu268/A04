import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, 
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"
    ],
    unique: [true, 'Username already exists!'] // Ensure username uniqueness
  },
  image: {
    type: String,
    default: 'default.jpg' // Example default image
  }
});

const User = models.User || model("User", UserSchema);

export default User;
