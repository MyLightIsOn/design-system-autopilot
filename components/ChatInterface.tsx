'use client';

import { useState } from 'react';
import MessageContent from './MessageContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onCodeGenerated?: (code: string, componentName: string) => void;
}

export default function ChatInterface({ onCodeGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Extract code blocks and trigger callback
      if (onCodeGenerated) {
        console.log('Checking for code blocks...');
        console.log('Response length:', data.response.length);

        // Match code blocks - handle various formats
        // This regex looks for ``` followed by optional language, then captures everything until closing ```
        const allCodeBlocks = data.response.match(/```[\w]*\s*([\s\S]*?)```/g);

        if (allCodeBlocks && allCodeBlocks.length > 0) {
          console.log(`Found ${allCodeBlocks.length} code blocks`);

          // Get the first code block that contains "export" (actual component code)
          let componentCode = null;
          let componentName = 'Component';

          for (const block of allCodeBlocks) {
            const codeMatch = block.match(/```[\w]*\s*([\s\S]*?)```/);
            if (codeMatch) {
              const code = codeMatch[1].trim();

              // Check if this is actual component code (has export or interface)
              if (code.includes('export') || code.includes('interface')) {
                componentCode = code;

                // Extract component name - look for export const/function, NOT interface
                const nameMatch = code.match(/export\s+(?:const|function)\s+(\w+)/);
                if (nameMatch) {
                  componentName = nameMatch[1];
                }

                console.log('Found component code, name:', componentName);
                break; // Use the first component found
              }
            }
          }

          if (componentCode) {
            onCodeGenerated(componentCode, componentName);
          } else {
            console.log('Code blocks found but no component code detected');
          }
        } else {
          console.log('No code blocks found in response');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error generating a response.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Ask me to generate a component from Figma!</p>
            <p className="text-sm mt-2">
              Example: "Generate a Button component from the ADS Components file"
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-8'
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <div className="font-semibold mb-2">
                {msg.role === 'user' ? 'You' : 'Claude'}
              </div>
              <MessageContent content={msg.content} />
            </div>
          ))
        )}
        {loading && (
          <div className="p-4 rounded-lg bg-gray-100 mr-8">
            <div className="font-semibold mb-1">Claude</div>
            <div className="text-gray-500">Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Claude to generate a component..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
