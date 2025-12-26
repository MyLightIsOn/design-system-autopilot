'use client';

import CodeBlock from './CodeBlock';

interface MessageContentProps {
  content: string;
}

export default function MessageContent({ content }: MessageContentProps) {
  // Parse code blocks from the content
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, idx) => {
        // Check if this part is a code block
        if (part.startsWith('```')) {
          // Extract language and code
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          if (match) {
            const language = match[1] || 'typescript';
            const code = match[2].trim();
            return <CodeBlock key={idx} code={code} language={language} />;
          }
        }

        // Regular text - preserve formatting
        return (
          <div key={idx} className="whitespace-pre-wrap">
            {part}
          </div>
        );
      })}
    </div>
  );
}
