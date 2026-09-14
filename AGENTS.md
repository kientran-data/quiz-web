# Agent Guidelines for Quiz Web Project

When working in this repository, agents must strictly adhere to the following verified conventions to preserve the project's purpose as a minimal training foundation.

## 1. Project Boundaries (STRICT)
- **Minimal Backend**: A lightweight Node.js/Express API with `better-sqlite3` is permitted. Do NOT introduce PostgreSQL, MySQL, Redis, ORMs (Prisma, Drizzle), or Docker.
- **NO New Dependencies**: Do not install additional third-party libraries (e.g., Redux, Zustand, Tailwind, Material UI, React Router) without explicit permission.
- **NO Out-of-Scope Features**: Do not implement complex animations or heavy authentication mechanisms. Keep the Admin flow simple.

## 2. Architecture & Module Responsibilities
- **Backend (`server/`)**: Manages SQLite data, scores quizzes to prevent cheating, and serves questions (without correct answers) to the client.
- **Frontend App (`src/App.tsx`)**: The top-level orchestrator. It manages conditional rendering based on the quiz status (using data from the `useQuiz` hook).
- **Frontend Components (`src/components/`)**: Reusable, strictly presentational React components.

## 3. Data & State Management
- **Quiz Data Location**: Hardcoded quiz data resides strictly on the server at `server/data/questions.json`.
- **State & Scoring**: Scoring is calculated on the server and saved in SQLite. Frontend state logic resides inside the custom hook at `src/hooks/useQuiz.ts` which uses `fetch` to communicate with the API.

## 4. Coding Conventions Observed
- **Type Safety**: Strictly enforced. Use TypeScript interfaces defined in `src/types/index.ts` and rely on `import type` for type-only imports to comply with `verbatimModuleSyntax`.
- **CSS**: Vanilla CSS only. Utilize simple class names, standard properties, Flexbox, and `@media (prefers-color-scheme: dark)` for dark mode support.
- **Component Style**: Use Functional Components (`React.FC`) exclusively.

## 5. Validation Commands
Always run the following command before concluding changes to ensure no types were broken:
```bash
npm run build
```
The build must succeed with zero TypeScript errors.
