# RAG Chatbot - Answers Questions About Alec

Currently building a chatbot that uses retrieval-augmented generation (RAG) to reason and respond with information outside of the model's training data. I kicked things off with a [Vercel AI SDK template](https://vercel.com/templates/next.js/ai-sdk-rag), tweaked the model prompt, and chunked & embedded my resume info in a vector database. After testing prompt responses on a working prototype, I'm now fine-tuning and adding more information chunks. Next up, I'll re-embed the updated chunks and see how they boost the chatbot’s responses.

If you're into AI or chatbots, let's connect and share insights!

## How it works

## Store the Context the Model does not have

![alt text](public/readme-images/embed-chunks.png)

## Retrieve stored context similar to query, combine into new query

![alt text](public/readme-images/user-query.png)

## Features

- Information retrieval and addition through tool calls using the [`streamText`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text) function
- Real-time streaming of model responses to the frontend using the [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) hook
- Vector embedding storage with [DrizzleORM](https://orm.drizzle.team/) and [PostgreSQL](https://www.postgresql.org/)
- Animated UI with [Framer Motion](https://www.framer.com/motion/)

## Images of the App

![Image of the chatbot](only-alec.png)

## Credits

The starter code and images used in this project are sourced from [Vercel's Guide](https://sdk.vercel.ai/docs/guides/rag-chatbot).  
