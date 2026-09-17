# JSON Toolbox

A lightweight, browser-based developer tool for formatting, validating, minifying, and inspecting JSON. It can also generate TypeScript interfaces from JSON data.

Built with React and TypeScript as a practical frontend project focused on clean component architecture, reusable utilities, type-safe development, and a polished developer-tool workflow.

## Features

- Format JSON with readable indentation
- Minify JSON into a compact format
- Validate JSON syntax
- Display useful JSON parsing errors
- Generate TypeScript interfaces from JSON
- Handle nested objects and arrays when generating types
- Merge object shapes when generating types from arrays
- Detect optional properties in heterogeneous object arrays
- Handle primitive unions such as `number | string`
- Copy JSON output to the clipboard
- Copy generated TypeScript to the clipboard
- Clear input and generated output
- Display empty states when no output is available
- Indicate when JSON output is out of date after editing the input
- Responsive two-panel JSON editor layout

## Tech Stack

- React
- TypeScript
- Vite
- SCSS
- Vitest

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### JSON Toolbox is intentionally lightweight and frontend-focused.

## The project aims to demonstrate:

- TypeScript fundamentals and type safety
- React component composition
- Separation of UI and utility logic
- Reusable components
- Discriminated unions
- Error handling
- Unit testing
- SCSS organization
- Responsive layouts
- Practical developer-tool UX

No backend or external API is required to use the core functionality.

## Potential future improvements include:

- JSON syntax highlighting
- Line numbers
- Better JSON error location highlighting
- Drag-and-drop JSON files
- JSON tree visualization
- JSON path inspection
- JSON ↔ TypeScript conversion improvements
- Additional TypeScript generation options
- Keyboard shortcuts
- Dark mode
- Additional test coverage
