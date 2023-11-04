const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    projectDescription: {
      type: String,
      required: true,
      trim: true,
    },
    diagram: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // A reference to the user who created the project
    diagramType: {
      type: String,
      reqired: true,
    },
    history: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        prompt: { type: String, required: true },
        diagram: { type: String, required: true },
        diagram_img: { type: String,required: true }, // NEW FIELD
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    
  },
  {
    timestamps: true, // this enables the automatic creation of `createdAt` and `updatedAt` fields
  },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
