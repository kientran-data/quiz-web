# Antigravity Training Quiz Application

## Project Purpose
This is a minimal, stable web quiz application designed specifically to serve as a foundation for Antigravity training demonstrations. The project deliberately avoids unnecessary abstractions, backends, databases, and third-party libraries to provide a clean and straightforward learning environment.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express
- **Database**: SQLite (via better-sqlite3)
- **Styling**: Vanilla CSS (No frameworks)

## Current Quiz Flow
The application follows a simple, strictly linear progression state machine:
1. **Start Screen**: User inputs name and email to register.
2. **Question Card**: Shows one question at a time. The user selects an option and clicks "Next Question" to proceed.
3. **Result Screen**: Displays the calculated final score (scored securely on the server) and provides a "Restart Quiz" button.

## Local Setup

To set up the project locally for development, ensure you have Node.js and `npm` installed, then run:

```bash
# Install dependencies
npm install
```

## Development Commands

**Start Full-Stack Development Server (Frontend + Backend):**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
```
This command also runs the TypeScript compiler (`tsc -b`) to verify type integrity before bundling.
