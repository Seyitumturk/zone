// accountService.js
const Accounts = require("../models/Accounts.js");

async function getAccountByUserId(user_id) {
  try {
    const account = await Accounts.findOne({ user_id });

    return account;
  } catch (error) {
    console.error("Error when retrieving account from MongoDB:", error);
    throw error;
  }
}

async function createAccount(accountData) {
  try {
    // create a new project instance
    const newAccount = new Accounts(accountData);

    // save it to the database
    await newAccount.save();

    console.log("Account created successfully:", newAccount);
    return newProject;
  } catch (error) {
    console.error("Error when trying to create a new account:", error);
    throw error; // or handle the error as you wish
  }
}

async function updateAccount(projectId, prompt, diagram) {
  try {
    const updatedProject = await Accounts.findOneAndUpdate(
      { _id: projectId },
      {
        $set: {
          prompt: prompt,
          diagram: diagram,
        },
        $push: {
          history: {
            $each: [
              {
                prompt: prompt,
                diagram: diagram,
                updated_at: Date.now(),
              },
            ],
            $slice: -5,
          },
        },
      },
      { new: true },
    );

    if (!updatedProject) {
      console.log("No project found with the provided ID.");
      return null;
    }

    console.log("Account updated successfully:", updatedProject);
    return updatedProject;
  } catch (error) {
    console.error("Error when trying to update the account:", error);
    throw error; // or handle the error as you wish
  }
}

async function deleteAccount(accountId) {}

module.exports = {
  getAccountByUserId,
  createAccount,
  updateAccount,
};
