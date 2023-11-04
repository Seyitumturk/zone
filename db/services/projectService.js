// projectService.js
const Projects = require("../models/Project.js");

async function getAllProjects() {}

async function getProjectsByUserId(
  userId,
  fieldsToPull,
  currentPage = 1,
  recordsPerPage = 20,
) {
  try {
    const fieldsString = fieldsToPull.join(" ");
    const skipRecords = (currentPage - 1) * recordsPerPage;

    const projects = await Projects.find({ user_id: userId }, fieldsString)
      .skip(skipRecords)
      .limit(recordsPerPage)
      .exec();

    return { data: projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { error: "Failed to retrieve projects" };
  }
}

async function getProjectByID(projectId) {
  let result;
  try {
    result = await Projects.findById(projectId);

    if (!result) {
      return res
        .status(404)
        .json({ message: "No project found with that ID." });
    }

    return result.toObject();
  } catch (err) {
    console.error("Error when trying to find the project:", err);
    return 500;
  }
}

async function createProject(projectData) {
  try {
    // create a new project instance
    const newProject = new Projects(projectData);

    // save it to the database
    await newProject.save();

    console.log("Project created successfully:", newProject);
    return newProject;
  } catch (error) {
    console.error("Error when trying to create a new project:", error);
    throw error; // or handle the error as you wish
  }
}

async function updateProject(projectId, prompt, diagram, svgThumbnail) {
  try {
    const updatedProject = await Projects.findOneAndUpdate(
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
                diagram_img: svgThumbnail,
                updatedAt: Date.now(),
              },
            ],
            $slice: -5,
          },
        },
      },
      { new: true },
    );
    // ... rest of the code
  } catch (error) {
    // ... handle the error
  }
}



async function loadProjectHistory(projectId, historyID) {}

async function getProjectHistory(projectId) {}

module.exports = {
  getAllProjects,
  getProjectsByUserId,
  getProjectByID,
  createProject,
  updateProject,
  loadProjectHistory,
  getProjectHistory,
};
