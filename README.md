# Sticky Notes App

![Sticky Notes Demo](./demo.gif)

A lightweight, performant, and interactive Sticky Notes application built with **React**, **TypeScript**, and **Vite**.



## Features
- **Create & Manage Notes**: Effortlessly add, edit, and delete notes.
- **Drag & Resize**: Intuitive pointer events for moving and resizing your notes anywhere on the board.
- **Color Themes**: Choose from a curated palette of themes to organize your thoughts.
- **Auto-Persistence**: Your work is automatically saved to local storage—never lose a note again.
- **Simulated API**: Includes a robust service layer that simulates real-world network latency.

## Architecture

The application following a unidirectional data flow pattern, leveraging a centralized `notesReducer` to manage state changes. This ensures that every action whether adding, updating, or removing a note is predictable and easy to debug. The state is then synchronized with a custom `useNotes` hook, which acts as the bridge between the UI components and the persistence layer.

For persistence and data management, the app utilizes a dual layer approach. A service layer handles both local storage synchronization and simulated asynchronous API calls, mimicking real  world behavior with randomized latency. This separation of concerns allows the UI to remain responsive while complex operations like data serialization and "network" requests happen transparently in the background.

The frontend is built with modular, highly reusable React components that utilize modern Pointer Events for interaction. By abstracting complex drag-and-drop and resizing logic into individual components like `StickyNote` and `Board`, the codebase remains maintainable and extensible. This modularity also facilitated the implementation of comprehensive test suite, allowing to verify each part of the system in isolation.

I have also added github actions for CI/CD. Automatically runs on pushes to main and feat/tests, and on all pull requests. Executes Linting, Testing (all 55 tests passing), and a Production Build to ensure project stability.


## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm run dev
```

## Testing
We take stability seriously. The project features a comprehensive test suite powered by **Vitest** and **React Testing Library**.

### Test Coverage
The suite includes **55 tests** covering:
- **Unit Logic**: `notesReducer`, `storage` persistence, `api` services, and `utils`.
- **Component UI**: Interactive testing for `StickyNote`, `Board`, `Toolbar`, `ColorPicker`, and `TrashZone`.

### Running Tests
- **Single Run**:
  ```bash
  npm test
  ```
- **Watch Mode** (great for development):
  ```bash
  npm run test:watch
  ```

## 🛠️ Built With
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tooling
- **Vitest** - Unit & Component Testing
- **React Testing Library** - DOM Testing Utilities
- **Vanilla CSS** - Styling

