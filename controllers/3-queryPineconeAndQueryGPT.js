const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { OpenAI } = require("langchain/llms/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { Document } = require("langchain/document");

const queryPineconeVectorStoreAndQueryLLM = async (client, indexName, question) => {
  let answer = "No answer available";
  console.log("Querying Pinecone vector store...");
  const index = client.Index(indexName);
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  let queryResponse = await index.query({
    queryRequest: {
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });

  console.log(`Found ${queryResponse.matches.length} matches...`);
  console.log(`Asking question: ${question}...`);

  if (queryResponse.matches.length) {
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);
    const concatenatedPageContent = queryResponse.matches.map((match) => match.metadata.pageContent).join(" ");

    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });

    console.log(`Answer: ${result.text}`);
    answer = result.text;
  } else {
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }

  return answer;
};

module.exports = { queryPineconeVectorStoreAndQueryLLM };
