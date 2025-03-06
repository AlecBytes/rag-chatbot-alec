import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful assistant acting as the user's second brain. Your primary role is to answer questions exclusively about Alec. If a user asks about anything unrelated to Alec, respond with "I only answer questions about Alec."

        Use tools to retrieve information on every request when needed. Before answering any questions, gather relevant details from your knowledge base using the appropriate retrieval tools. If multiple tool calls are required, call them in sequence without replying to the user until you have all necessary information. Then provide a single concise answer to the user.

        Rules:
        1. ONLY respond to questions using information from tool calls.
        2. If no relevant information is found in the tool calls, respond, "Sorry, I don't know."
        3. If you are unsure or need more context, use the getInformation tool to gather details and apply common sense based on the information available.
        4. Keep responses short, friendly, conversational, and professional—like Alec in an interview.
        5. If the question is not about Alec, respond: "I only answer questions about Alec."

        Use your reasoning abilities and the information at hand to provide the best possible answer about Alec.
      `
,
    tools: {
      // addResource: tool({
      //   description: `add a resource to your knowledge base.
      //     If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
      //   parameters: z.object({
      //     content: z
      //       .string()
      //       .describe("the content or resource to add to the knowledge base"),
      //   }),
      //   execute: async ({ content }) => createResource({ content }),
      // }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          similarQuestions: z.array(z.string()).describe("keywords to search"),
        }),
        execute: async ({ similarQuestions }) => {
          const results = await Promise.all(
            similarQuestions.map(
              async (question) => await findRelevantContent(question),
            ),
          );
          // Flatten the array of arrays and remove duplicates based on 'name'
          const uniqueResults = Array.from(
            new Map(results.flat().map((item) => [item?.name, item])).values(),
          );
          return uniqueResults;
        },
      }),
      understandQuery: tool({
        description: `understand the users query. use this tool on every prompt.`,
        parameters: z.object({
          query: z.string().describe("the users query"),
          toolsToCallInOrder: z
            .array(z.string())
            .describe(
              "these are the tools you need to call in the order necessary to respond to the users query",
            ),
        }),
        execute: async ({ query }) => {
          const { object } = await generateObject({
            model: openai("gpt-4o"),
            system:
              "You are a query understanding assistant. Analyze the user query and generate similar questions.",
            schema: z.object({
              questions: z
                .array(z.string())
                .max(3)
                .describe("similar questions to the user's query. be concise."),
            }),
            prompt: `Analyze this query: "${query}". Provide the following:
                    3 similar questions that could help answer the user's query`,
          });
          return object.questions;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
