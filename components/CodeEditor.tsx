'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import LivePreview from './LivePreview';

interface CodeEditorProps {
  initialCode: string;
  componentName: string;
}

export default function CodeEditor({ initialCode, componentName }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  // Update code when initial code changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{componentName}</h2>
        <button
          onClick={copyCode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Code Editor */}
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
            Code Editor
          </div>
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Live Preview */}
        <div className="flex flex-col border rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
            Live Preview
          </div>
          <LivePreview code={code} componentName={componentName} />
        </div>
      </div>
    </div>
  );
}
