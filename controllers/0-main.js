const { PineconeClient } = require("@pinecone-database/pinecone");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const dotenv = require("dotenv");
const { createPineconeIndex } = require("./1-createPineconeIndex");
const { updatePinecone } = require("./2-updatePinecone");
const { queryPineconeVectorStoreAndQueryLLM } = require("./3-queryPineconeAndQueryGPT");

dotenv.config();

const client = new PineconeClient();

// Create an async init function to handle the async operations
async function init() {
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const loader = new DirectoryLoader("./controllers/documents", {
    ".txt": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();
  const indexName = "ac-pedia";
  const vectorDimension = 1536;

  async function processQuestion(question) {
    await createPineconeIndex(client, indexName, vectorDimension);
    await updatePinecone(client, indexName, docs);
    const answer = await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
    return answer;
  }

  module.exports = { processQuestion, init };  // Export the init function as well
}

init();  // Call the init function to execute the async code
