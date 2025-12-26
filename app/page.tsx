import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Design System Autopilot</h1>
          <p className="text-gray-600">
            AI-powered code generation from Figma designs using Claude + MCP
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left: Chat with Claude */}
          <div className="border rounded-lg p-6 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Chat with Claude</h2>
            <ChatInterface />
          </div>

          {/* Right: Info & Instructions */}
          <div className="border rounded-lg p-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">How it Works</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">🔧 MCP Tools Available</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• <code className="bg-white px-1 rounded">figma_get_file</code> - Fetch Figma file structure</li>
                  <li>• <code className="bg-white px-1 rounded">figma_search_components</code> - Search for components</li>
                  <li>• <code className="bg-white px-1 rounded">figma_get_component</code> - Get component details</li>
                  <li>• <code className="bg-white px-1 rounded">codegen_react_component</code> - Generate React code</li>
                  <li>• <code className="bg-white px-1 rounded">a11y_audit_component</code> - Check accessibility</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Example Prompts</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="p-2 bg-white rounded">
                    "Search for button components in the ADS Components file"
                  </li>
                  <li className="p-2 bg-white rounded">
                    "Generate a React button component from Figma"
                  </li>
                  <li className="p-2 bg-white rounded">
                    "Create an accessible form component"
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">📋 File Keys</h3>
                <ul className="text-sm space-y-1 text-gray-700 font-mono">
                  <li>• ADS Foundations: <code className="bg-white px-1 rounded">PyCTDDkI4VZLv9JbYaXnpy</code></li>
                  <li>• ADS Components: <code className="bg-white px-1 rounded">C3ffSlzDqL2UAKqWaAtrju</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
