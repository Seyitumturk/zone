// userService.js
const Users = require("../models/User.js");

async function createOrUpdateUser(email, firebaseUserUid) {
  try {
    const userUpdate = await Users.updateOne(
      { email: email },
      { $set: { email: email, firebaseId: firebaseUserUid } },
      { upsert: true },
    );

    return userUpdate;
  } catch (error) {
    console.error("Error when saving user to MongoDB:", error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    const user = await Users.findOne({ email });

    return user;
  } catch (error) {
    console.error("Error when retrieving user from MongoDB:", error);
    throw error;
  }
}

async function findUserByFirebaseId(firebaseId) {
  try {
    const user = await Users.findOne(firebaseId);

    return user;
  } catch (error) {
    console.error("Error when retrieving user from MongoDB:", error);
    throw error;
  }
}

module.exports = {
  createOrUpdateUser,
  findUserByEmail,
  findUserByFirebaseId,
};
