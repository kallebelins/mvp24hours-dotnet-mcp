# Contributing to Mvp24Hours .NET MCP Server

First off, thank you for considering contributing to Mvp24Hours .NET MCP Server! 🎉

It's people like you that make this project such a great tool for the .NET community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [kallebelins@gmail.com](mailto:kallebelins@gmail.com).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, configuration files)
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **Include examples of how the feature would be used**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues perfect for newcomers
- `help wanted` - Issues that need community help
- `documentation` - Documentation improvements

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the setup instructions** below
3. **Make your changes** following our style guidelines
4. **Add tests** if applicable
5. **Update documentation** if needed
6. **Submit your pull request**

#### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass
- [ ] No new warnings

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/mvp24hours-dotnet-mcp.git
cd mvp24hours-dotnet-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start development mode (watch for changes)
npm run dev
```

### Testing Your Changes

```bash
# Build and test locally
npm run build
node dist/index.js
```

### Project Structure

```
src/
├── index.ts                    # MCP Server entry point
├── tools/                      # MCP tools implementation
│   ├── get-started.ts          # Framework overview
│   ├── architecture-advisor.ts # Architecture selection
│   ├── database-advisor.ts     # Database configuration
│   └── ...                     # Other tools
└── utils/
    └── doc-loader.ts           # Documentation loader

docs/                           # Documentation files
├── ai-context/                 # AI context documentation
├── modernization/              # Modernization guides
└── ...                         # Other docs
```

## Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(tools): add security-patterns tool
fix(database-advisor): correct PostgreSQL configuration
docs: update README with new tools
```

### Documentation

- Use clear, concise language
- Include code examples where helpful
- Keep documentation up-to-date with code changes
- Use Markdown formatting consistently

## Adding New Tools

When adding a new MCP tool:

1. Create a new file in `src/tools/`
2. Follow the existing tool pattern
3. Register the tool in `src/index.ts`
4. Add corresponding documentation in `docs/`
5. Update the README.md with the new tool

Example tool structure:

```typescript
import { z } from 'zod';

export const myNewToolSchema = z.object({
  parameter: z.string().describe('Parameter description'),
});

export async function myNewTool(args: z.infer<typeof myNewToolSchema>) {
  // Implementation
  return {
    content: [
      {
        type: 'text',
        text: '...',
      },
    ],
  };
}
```

## Community

- **GitHub Discussions**: Ask questions, share ideas
- **Issues**: Report bugs, request features
- **Pull Requests**: Contribute code

### Related Projects

- [Mvp24Hours .NET Framework](https://github.com/kallebelins/mvp24hours-dotnet)
- [Mvp24Hours .NET Samples](https://github.com/kallebelins/mvp24hours-dotnet-samples)
- [Semantic Kernel Graph](https://github.com/kallebelins/semantic-kernel-graph)

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes
- Our community page

Thank you for contributing! 🙏
