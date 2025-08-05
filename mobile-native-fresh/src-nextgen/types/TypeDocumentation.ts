/**
 * Core Types Documentation
 * 
 * This file contains comprehensive documentation for all core types
 * used in the Thoughtmark mobile application.
 */

// ApiResponse type is used in the documentation but not imported

export interface TypeDocumentation {
  typeName: string;
  description: string;
  properties: PropertyDocumentation[];
  examples: string[];
  usage: string[];
  notes: string[];
}

export interface PropertyDocumentation {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
}

export const typeDocumentation: Record<string, TypeDocumentation> = {
  User: {
    typeName: 'User',
    description: 'Represents a user in the Thoughtmark application',
    properties: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unique identifier for the user',
        example: '"user-123"',
      },
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'User email address',
        example: '"user@example.com"',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'User display name',
        example: '"John Doe"',
      },
      {
        name: 'avatar',
        type: 'string | undefined',
        required: false,
        description: 'URL to user avatar image',
        example: '"https://example.com/avatar.jpg"',
      },
      {
        name: 'isPremium',
        type: 'boolean',
        required: true,
        description: 'Whether user has premium subscription',
        example: 'true',
      },
      {
        name: 'createdAt',
        type: 'string',
        required: true,
        description: 'ISO timestamp of user creation',
        example: '"2023-01-01T00:00:00.000Z"',
      },
      {
        name: 'updatedAt',
        type: 'string',
        required: true,
        description: 'ISO timestamp of last user update',
        example: '"2023-01-01T00:00:00.000Z"',
      },
    ],
    examples: [
      `const user: User = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  isPremium: false,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};`,
    ],
    usage: [
      'User authentication and profile management',
      'Displaying user information in UI components',
      'API requests requiring user context',
    ],
    notes: [
      'All timestamps should be in ISO 8601 format',
      'Email addresses should be validated before use',
      'Premium status affects feature availability',
    ],
  },

  Thoughtmark: {
    typeName: 'Thoughtmark',
    description: 'Represents a thoughtmark (note) in the application',
    properties: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unique identifier for the thoughtmark',
        example: '"thought-123"',
      },
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Title of the thoughtmark',
        example: '"My Important Note"',
      },
      {
        name: 'content',
        type: 'string',
        required: true,
        description: 'Content/body of the thoughtmark',
        example: '"This is the content of my thoughtmark..."',
      },
      {
        name: 'tags',
        type: 'string[]',
        required: true,
        description: 'Array of tags associated with the thoughtmark',
        example: '["important", "work", "ideas"]',
      },
      {
        name: 'binId',
        type: 'string',
        required: true,
        description: 'ID of the bin containing this thoughtmark',
        example: '"bin-123"',
      },
      {
        name: 'isArchived',
        type: 'boolean',
        required: true,
        description: 'Whether the thoughtmark is archived',
        example: 'false',
      },
      {
        name: 'isPinned',
        type: 'boolean',
        required: true,
        description: 'Whether the thoughtmark is pinned',
        example: 'false',
      },
    ],
    examples: [
      `const thoughtmark: Thoughtmark = {
  id: 'thought-123',
  title: 'My Important Note',
  content: 'This is the content...',
  tags: ['important', 'work'],
  binId: 'bin-123',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  isArchived: false,
  isPinned: false,
};`,
    ],
    usage: [
      'Displaying thoughtmarks in lists and grids',
      'Editing and creating new thoughtmarks',
      'Searching and filtering thoughtmarks',
    ],
    notes: [
      'Content can contain markdown formatting',
      'Tags are case-insensitive',
      'Archived thoughtmarks are hidden by default',
    ],
  },

  ApiResponse: {
    typeName: 'ApiResponse<T>',
    description: 'Standard API response wrapper',
    properties: [
      {
        name: 'data',
        type: 'T',
        required: true,
        description: 'Response data payload',
        example: 'User | Thoughtmark[] | any',
      },
      {
        name: 'status',
        type: 'number',
        required: true,
        description: 'HTTP status code',
        example: '200',
      },
      {
        name: 'message',
        type: 'string',
        required: true,
        description: 'Response message',
        example: '"Success"',
      },
      {
        name: 'success',
        type: 'boolean',
        required: true,
        description: 'Whether the request was successful',
        example: 'true',
      },
      {
        name: 'timestamp',
        type: 'string',
        required: true,
        description: 'ISO timestamp of response',
        example: '"2023-01-01T00:00:00.000Z"',
      },
    ],
    examples: [
      `const response: ApiResponse<User> = {
  data: user,
  status: 200,
  message: 'User retrieved successfully',
  success: true,
  timestamp: '2023-01-01T00:00:00.000Z',
};`,
    ],
    usage: [
      'API client responses',
      'Error handling and success states',
      'Type-safe data access',
    ],
    notes: [
      'Generic type T should match expected response data',
      'Always check success flag before using data',
      'Status codes follow HTTP standards',
    ],
  },
};

export function getTypeDocumentation(typeName: string): TypeDocumentation | undefined {
  return typeDocumentation[typeName];
}

export function getAllTypeDocumentation(): Record<string, TypeDocumentation> {
  return { ...typeDocumentation };
}

export function generateTypeDocumentation(): string {
  let documentation = '# Core Types Documentation\n\n';
  
  Object.values(typeDocumentation).forEach(typeDoc => {
    documentation += `## ${typeDoc.typeName}\n\n`;
    documentation += `${typeDoc.description}\n\n`;
    
    documentation += '### Properties\n\n';
    typeDoc.properties.forEach(prop => {
      documentation += `- **${prop.name}** (${prop.type}${prop.required ? ', required' : ', optional'}) - ${prop.description}\n`;
    });
    
    documentation += '\n### Examples\n\n';
    typeDoc.examples.forEach(example => {
      documentation += `\`\`\`typescript\n${example}\n\`\`\`\n\n`;
    });
    
    documentation += '### Usage\n\n';
    typeDoc.usage.forEach(usage => {
      documentation += `- ${usage}\n`;
    });
    
    if (typeDoc.notes.length > 0) {
      documentation += '\n### Notes\n\n';
      typeDoc.notes.forEach(note => {
        documentation += `- ${note}\n`;
      });
    }
    
    documentation += '\n---\n\n';
  });
  
  return documentation;
} 