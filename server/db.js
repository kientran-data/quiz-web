import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'quiz.db');

const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT,
    open_time DATETIME,
    close_time DATETIME,
    duration_minutes INTEGER,
    questions_per_attempt INTEGER DEFAULT 20
  );

  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    team TEXT
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER,
    started_at DATETIME,
    submitted_at DATETIME,
    elapsed_seconds INTEGER,
    score INTEGER,
    status TEXT DEFAULT 'in_progress',
    assigned_question_ids TEXT,
    FOREIGN KEY(participant_id) REFERENCES participants(id)
  );

  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER,
    question_id TEXT,
    selected_option_index INTEGER,
    is_correct BOOLEAN,
    FOREIGN KEY(attempt_id) REFERENCES attempts(id)
  );
`);

// Insert default config if it doesn't exist
const configExists = db.prepare('SELECT 1 FROM quiz_config WHERE id = 1').get();
if (!configExists) {
  db.prepare(`
    INSERT INTO quiz_config (id, title, duration_minutes, questions_per_attempt)
    VALUES (1, 'Antigravity Training Quiz', 30, 20)
  `).run();
}

export default db;
