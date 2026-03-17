# Tree Builder - React Native App

A React Native application for parsing and visualizing tree data structures with interactive gestures.

## Features

- **Tree Parsing**: Parse string input into n-ary tree structures
  - Syntax: `>` for parent-child, `,` for siblings, `;` for new statements
  - Example: `A > B, C, D; B > E, F`
  
- **Visual Tree Display**: 
  - Hierarchical layout with SVG connector lines
  - Auto-scaling to fit viewport
  - Clean, modern UI with shadows and styling

- **Interactive Gestures**:
  - **Pan**: Drag to move the tree around
  - **Pinch-to-Zoom**: Zoom in/out (0.3x - 2x scale)
  - Smooth animations with Reanimated

- **Validation**:
  - Cycle detection
  - Multiple parent detection
  - Empty node validation
  - Clear error messages

## Project Structure

```
task/
├── components/
│   └── TreeView.tsx          # Tree visualization component
├── types/
│   └── tree.types.ts         # TypeScript interfaces
├── utils/
│   ├── treeParser.ts         # Tree parsing logic
│   └── __tests__/
│       └── treeParser.test.ts # Unit tests
├── App.tsx                   # Main application
└── babel.config.js           # Babel configuration
```

## Installation

```bash
npm install
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Usage

1. Enter a tree structure in the input field using the syntax:
   - `A > B` - A is parent of B
   - `A > B, C` - A is parent of B and C
   - `A > B > C` - Nested relationships
   - `A > B; A > C` - Multiple statements

2. Press "Build Tree" to visualize

3. Use gestures to interact:
   - **Drag** to pan the tree
   - **Pinch** to zoom in/out

## Examples

```
A > B, C, D
```
Creates a tree with A as root and B, C, D as children.

```
A > B > C, D; A > E
```
Creates a tree with A as root, B as child of A with C and D as children of B, and E as another child of A.

## Technologies

- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **Expo** - Development platform
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch gestures
- **React Native SVG** - Vector graphics for connectors
- **Jest** - Testing framework

## License

Private project
