import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { InformationIcon, VercelIcon } from "./icons";

const ProjectOverview = () => {
  return (
    <motion.div
      className="w-full max-w-[600px] my-4"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 5 }}
    >
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-neutral-500 text-sm dark:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="flex flex-row justify-center gap-4 items-center text-neutral-900 dark:text-neutral-50">
          {/* <VercelIcon size={16} />
          <span>+</span> */}
          <InformationIcon />
        </p>
        <p>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Alec&apos;s Professional AI Assistant</span> - Ask me anything about Alec&apos;s experience, education, skills, projects, and career accomplishments.
        </p>
        <p>
          This chatbot uses retrieval augmented generation (RAG) to access and present accurate information about Alec&apos;s professional background. Feel free to ask specific questions about his qualifications, technical expertise, work history, or educational background.
        </p>
        <p className="italic text-red-500">
          *Please note, this is an early prototype and responses may not always be accurate.
        </p>
        {/* <p>
          Built with the{" "}
          <Link
            href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat"
            className="text-blue-500"
          >
            useChat
          </Link>{" "}
          hook and{" "}
          <Link
            href="https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text"
            className="text-blue-500"
          >
            streamText
          </Link>{" "}
          function from the Vercel AI SDK, this assistant leverages vector embeddings stored in PostgreSQL to provide accurate and relevant responses.
        </p> */}
      </div>
    </motion.div>
  );
};

export default ProjectOverview;