/**
 * MCP Client - Mock Implementation for Demo
 * Uses realistic Figma data without hitting API limits
 */

interface ToolCall {
  name: string;
  input: any;
}

interface ToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

// Mock component data for form-related components
const MOCK_COMPONENTS: Record<string, any> = {
  'textfield': {
    id: '70388:8001',
    name: 'TextField / Default',
    type: 'COMPONENT',
    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
    strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    cornerRadius: 3,
  },
  'textarea': {
    id: '70391:8030',
    name: 'TextArea / Default',
    type: 'COMPONENT',
    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
    strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    cornerRadius: 3,
  },
  'button': {
    id: '70387:7994',
    name: 'Button / Primary',
    type: 'COMPONENT',
    fills: [{ type: 'SOLID', color: { r: 0.0, g: 0.32, b: 0.8 } }],
    paddingTop: 6,
    paddingRight: 12,
    paddingBottom: 6,
    paddingLeft: 12,
    cornerRadius: 3,
  },
  'label': {
    id: '70389:8010',
    name: 'Label / Default',
    type: 'COMPONENT',
    fills: [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.09 } }],
    paddingBottom: 4,
  },
};

export async function executeMCPTool(toolName: string, input: any): Promise<ToolResult> {
  console.log(`Executing mock tool: ${toolName}`, input);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (toolName === 'figma_search_components') {
    const query = input.query.toLowerCase();
    let components: any[] = [];

    // Return form-related components for form queries
    if (query.includes('form') || query.includes('contact')) {
      components = [
        { id: '70388:8001', name: 'TextField / Default', type: 'COMPONENT' },
        { id: '70391:8030', name: 'TextArea / Default', type: 'COMPONENT' },
        { id: '70387:7994', name: 'Button / Primary', type: 'COMPONENT' },
        { id: '70389:8010', name: 'Label / Default', type: 'COMPONENT' },
      ];
    } else if (query.includes('button')) {
      components = [
        { id: '70387:7994', name: 'Button / Primary', type: 'COMPONENT' },
      ];
    } else if (query.includes('input') || query.includes('text')) {
      components = [
        { id: '70388:8001', name: 'TextField / Default', type: 'COMPONENT' },
        { id: '70391:8030', name: 'TextArea / Default', type: 'COMPONENT' },
      ];
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          query: input.query,
          count: components.length,
          components,
        }, null, 2),
      }],
    };
  }

  if (toolName === 'figma_get_component') {
    const idMap: Record<string, string> = {
      '70387:7994': 'button',
      '70388:8001': 'textfield',
      '70389:8010': 'label',
      '70391:8030': 'textarea',
    };

    const key = idMap[input.nodeId];
    const component = key ? MOCK_COMPONENTS[key] : MOCK_COMPONENTS['button'];

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          nodeId: input.nodeId,
          component,
        }, null, 2),
      }],
    };
  }

  if (toolName === 'codegen_react_component') {
    const componentData = input.componentData;
    const node = componentData.component || componentData;
    const name = input.componentName;

    let code = generateComponentCode(name, node);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          componentName: name,
          code,
          hasTypes: true,
        }, null, 2),
      }],
    };
  }

  return {
    content: [{
      type: 'text',
      text: `Tool ${toolName} executed`,
    }],
  };
}

function generateComponentCode(name: string, node: any): string {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('textfield') || lowerName.includes('input')) {
    return `import React from 'react';

interface ${name}Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export const ${name}: React.FC<${name}Props> = (props) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {props.label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600 }}>
          {props.label}
          {props.required && <span style={{ color: 'red' }}> *</span>}
        </label>
      )}
      <input 
        type="text" 
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required}
        style={{ 
          padding: '8px 12px',
          borderRadius: '3px',
          border: '1px solid #ccc',
          fontSize: '14px',
          width: '100%',
        }}
      />
    </div>
  );
};`;
  }

  if (lowerName.includes('textarea') || lowerName.includes('message')) {
    return `import React from 'react';

interface ${name}Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export const ${name}: React.FC<${name}Props> = (props) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {props.label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600 }}>
          {props.label}
        </label>
      )}
      <textarea 
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        rows={props.rows || 4}
        style={{ 
          padding: '8px 12px',
          borderRadius: '3px',
          border: '1px solid #ccc',
          fontSize: '14px',
          width: '100%',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
};`;
  }

  // Default to button
  return `import React from 'react';

interface ${name}Props {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: 'submit' | 'button';
}

export const ${name}: React.FC<${name}Props> = (props) => {
  return (
    <button 
      type={props.type || 'button'}
      onClick={props.onClick} 
      disabled={props.disabled}
      style={{ 
        padding: '6px 12px',
        borderRadius: '3px',
        backgroundColor: '#0052cc',
        border: 'none',
        color: 'white',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
};`;
}

export async function executeToolUses(toolUses: ToolCall[]): Promise<ToolResult[]> {
  const results: ToolResult[] = [];

  for (const toolUse of toolUses) {
    const result = await executeMCPTool(toolUse.name, toolUse.input);
    results.push(result);
  }

  return results;
}
