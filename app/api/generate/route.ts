import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { executeToolUses } from '@/lib/mcp-client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the MCP tools that Claude can use
const MCP_TOOLS = [
  {
    name: 'figma_get_file',
    description: 'Fetch a Figma file structure and metadata. Returns the full file tree including all pages, frames, and components.',
    input_schema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'The Figma file key (from the URL: figma.com/file/FILE_KEY/...)',
        },
      },
      required: ['fileKey'],
    },
  },
  {
    name: 'figma_search_components',
    description: 'Search for components in a Figma file by name or type (e.g., "button", "input", "form").',
    input_schema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'The Figma file key',
        },
        query: {
          type: 'string',
          description: 'Search query (component name or type)',
        },
      },
      required: ['fileKey', 'query'],
    },
  },
  {
    name: 'figma_get_component',
    description: 'Get detailed information about a specific component in a Figma file.',
    input_schema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'The Figma file key',
        },
        nodeId: {
          type: 'string',
          description: 'The node ID of the component',
        },
      },
      required: ['fileKey', 'nodeId'],
    },
  },
  {
    name: 'codegen_react_component',
    description: 'Generate a React component from Figma component data.',
    input_schema: {
      type: 'object',
      properties: {
        componentData: {
          type: 'object',
          description: 'Figma component data (from figma_get_component)',
        },
        componentName: {
          type: 'string',
          description: 'Desired component name in PascalCase',
        },
        includeTypes: {
          type: 'boolean',
          description: 'Include TypeScript types/interfaces',
          default: true,
        },
      },
      required: ['componentData', 'componentName'],
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Agentic loop: keep calling Claude until it stops using tools
    const conversationHistory: any[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    let finalResponse = '';
    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops

    while (iterations < maxIterations) {
      iterations++;
      
      console.log(`\n=== Iteration ${iterations} ===`);

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: MCP_TOOLS as any,
        messages: conversationHistory,
      });
      
      console.log('Stop reason:', message.stop_reason);
      console.log('Content blocks:', message.content.map((b: any) => b.type));

      // Check if Claude wants to use tools
      if (message.stop_reason === 'tool_use') {
        // Extract tool uses
        const toolUses = message.content.filter((block: any) => block.type === 'tool_use');
        
        console.log('Tool uses:', toolUses.map((t: any) => t.name));
        
        // Execute the tools
        const toolResults = await executeToolUses(
          toolUses.map((t: any) => ({ name: t.name, input: t.input }))
        );
        
        console.log('Tool results received:', toolResults.length);

        // Add Claude's response to history
        conversationHistory.push({
          role: 'assistant',
          content: message.content,
        });

        // Add tool results to history
        conversationHistory.push({
          role: 'user',
          content: toolUses.map((toolUse: any, idx: number) => ({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: toolResults[idx].content[0].text,
          })),
        });

        // Continue the loop - Claude will use the tool results
        continue;
      }

      // No more tool use - extract final response
      finalResponse = message.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');
      
      console.log('Got text response, breaking loop');

      break;
    }

    // Log for debugging
    console.log('Final response:', finalResponse);
    console.log('Iterations:', iterations);

    if (!finalResponse) {
      return NextResponse.json({
        error: 'No response generated after tool execution',
        iterations,
      }, { status: 500 });
    }

    return NextResponse.json({
      response: finalResponse,
      iterations,
    });
  } catch (error) {
    console.error('Error calling Claude:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
