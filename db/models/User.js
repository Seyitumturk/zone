const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    firebaseId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return validator.isEmail(email);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    onboarding_completed: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // this enables the automatic creation of `createdAt` and `updatedAt` fields
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
