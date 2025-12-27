'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import CodeEditor from '@/components/CodeEditor';

type Tab = 'chat' | 'editor';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [componentName, setComponentName] = useState<string>('');

  const handleCodeGenerated = (code: string, name: string) => {
    console.log('handleCodeGenerated called!', { name, codeLength: code.length });
    setGeneratedCode(code);
    setComponentName(name);
    setActiveTab('editor');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-8 border-b">
        <header className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Design System Autopilot</h1>
          <p className="text-gray-600">
            AI-powered code generation from Figma designs using Claude + MCP
          </p>
        </header>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Chat
            </button>
            {generatedCode && (
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'editor'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Code Editor
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {componentName}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <div className="h-full max-w-7xl mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left: Chat with Claude */}
              <div className="border rounded-lg p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">Chat with Claude</h2>
                <ChatInterface onCodeGenerated={handleCodeGenerated} />
              </div>

              {/* Right: Info */}
              <div className="border rounded-lg p-6 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">How it Works</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">🔧 MCP Tools</h3>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Search components in Figma</li>
                      <li>• Generate React code</li>
                      <li>• Live code preview</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">💡 Try This</h3>
                    <p className="text-sm p-2 bg-white rounded">
                      "Create a contact form with email and message fields"
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold mb-2">✨ Features</h3>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Live code editor with Monaco</li>
                      <li>• Real-time component preview</li>
                      <li>• Copy code to clipboard</li>
                      <li>• Tab between chat and editor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {generatedCode && (
              <CodeEditor
                initialCode={generatedCode}
                componentName={componentName}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
