# AI SDK RAG Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnicoalbanese%2Fai-sdk-rag-template&env=OPENAI_API_KEY&envDescription=You%20will%20need%20an%20OPENAI%20API%20Key.&project-name=ai-sdk-rag&repository-name=ai-sdk-rag&stores=%5B%7B%22type%22%3A%22postgres%22%7D%5D&skippable-integrations=1)

A [Next.js](https://nextjs.org/) application, powered by the Vercel AI SDK, that uses retrieval-augmented generation (RAG) to reason and respond with information outside of the model's training data.

## Features

- Information retrieval and addition through tool calls using the [`streamText`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text) function
- Real-time streaming of model responses to the frontend using the [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) hook
- Vector embedding storage with [DrizzleORM](https://orm.drizzle.team/) and [PostgreSQL](https://www.postgresql.org/)
- Animated UI with [Framer Motion](https://www.framer.com/motion/)

## Getting Started

To get the project up and running, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI API key and PostgreSQL connection string to the `.env` file:

   ```
   OPENAI_API_KEY=your_api_key_here
   DATABASE_URL=your_postgres_connection_string_here
   ```

4. Migrate the database schema:

   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Your project should now be running on [http://localhost:3000](http://localhost:3000).


## Prompts

### Original Prompt

`You are a helpful assistant acting as the users' second brain.
    Use tools on every request.
    Be sure to getInformation from your knowledge base before answering any questions.
    If the user presents information about themselves, use the addResource tool to store it.
    If a response requires multiple tools, call one tool after another without responding to the user.
    If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
    ONLY respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
    Be sure to adhere to any instructions in tool calls ie. if they say to respond like "...", do exactly that.
    If the relevant information is not a direct match to the users prompt, you can be creative in deducing the answer.
    Keep responses short and concise. Answer in a single sentence where possible.
    If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
    Use your abilities as a reasoning machine to answer questions based on the information you do have.
`
