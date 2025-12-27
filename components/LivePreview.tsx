'use client';

import { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';

interface LivePreviewProps {
  code: string;
  componentName: string;
}

export default function LivePreview({ code, componentName }: LivePreviewProps) {
  const [iframeContent, setIframeContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('LivePreview rendering with:', { componentName, codeLength: code.length });

    try {
      // Transform TypeScript/JSX to JavaScript
      console.log('Starting Babel transform...');
      const transformed = Babel.transform(code, {
        presets: ['react', 'typescript'],
        filename: `${componentName}.tsx`,
        sourceMaps: false, // Disable source maps to avoid warnings
      }).code;

      console.log('Babel transform complete, code length:', transformed?.length);

      // Create the HTML document for the iframe
      const iframeDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: #f9f9f9;
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script>
              console.log('Iframe script starting...');
              try {
                console.log('React available:', typeof React !== 'undefined');
                console.log('ReactDOM available:', typeof ReactDOM !== 'undefined');
                
                const { createElement: h } = React;
                const { createRoot } = ReactDOM;
                
                console.log('About to execute transformed code...');
                ${transformed}
                
                console.log('Component defined, componentName:', '${componentName}');
                
                // Create examples of the component
                const root = createRoot(document.getElementById('root'));
                
                // Render different states based on component type
                const componentName = '${componentName}';
                const Component = ${componentName};
                
                console.log('Component:', Component);
                
                if (componentName.toLowerCase().includes('textfield') || componentName.toLowerCase().includes('input')) {
                  console.log('Rendering TextField...');
                  root.render(
                    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Default'),
                        h(Component, { label: 'Email', placeholder: 'Enter your email', type: 'email' })
                      ),
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Required'),
                        h(Component, { label: 'Name', placeholder: 'Your name', required: true })
                      ),
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Disabled'),
                        h(Component, { label: 'Disabled', placeholder: 'Cannot edit', disabled: true })
                      )
                    )
                  );
                } else if (componentName.toLowerCase().includes('textarea') || componentName.toLowerCase().includes('message')) {
                  console.log('Rendering TextArea...');
                  root.render(
                    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Default'),
                        h(Component, { label: 'Message', placeholder: 'Enter your message...' })
                      ),
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'With More Rows'),
                        h(Component, { label: 'Description', placeholder: 'Tell us more...', rows: 6 })
                      )
                    )
                  );
                } else if (componentName.toLowerCase().includes('button')) {
                  console.log('Rendering Button...');
                  root.render(
                    h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } },
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Default'),
                        h(Component, null, 'Click Me')
                      ),
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Disabled'),
                        h(Component, { disabled: true }, 'Disabled')
                      ),
                      h('div', null,
                        h('h3', { style: { marginBottom: '8px', fontSize: '14px', color: '#666' } }, 'Submit'),
                        h(Component, { type: 'submit' }, 'Submit Form')
                      )
                    )
                  );
                } else {
                  console.log('Rendering generic component...');
                  // Generic component
                  root.render(
                    h('div', null,
                      h(Component, null, 'Sample Content')
                    )
                  );
                }
                console.log('Render complete!');
              } catch (err) {
                console.error('Preview error:', err);
                document.body.innerHTML = '<div style="color: red; padding: 20px;"><strong>Preview Error:</strong><br/>' + err.message + '<br/><pre>' + err.stack + '</pre></div>';
              }
            </script>
          </body>
        </html>
      `;

      console.log('Setting iframe content...');
      setIframeContent(iframeDoc);
      setError(null);
    } catch (err) {
      console.error('Compilation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to compile');
    }
  }, [code, componentName]);

  return (
    <div className="h-full flex flex-col">
      {error ? (
        <div className="flex-1 p-4 bg-red-50 text-red-700 text-sm">
          <strong>Compilation Error:</strong>
          <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <iframe
          srcDoc={iframeContent}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts"
          title="Component Preview"
        />
      )}
    </div>
  );
}
