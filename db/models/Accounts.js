const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      // Type of account, for example: 'business', 'personal', etc.
      type: String,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Referencing the User model
      },
    ],
  },
  {
    timestamps: true, // this enables the automatic creation of `createdAt` and `updatedAt` fields
  },
);

const Accounts = mongoose.model("Accounts", accountSchema);

module.exports = Accounts;
