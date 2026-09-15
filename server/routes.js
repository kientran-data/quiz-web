import express from 'express';
import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load questions from JSON
const questionsPath = path.join(__dirname, 'data', 'questions.json');
const getQuestions = () => JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// SSE Admin Clients
let adminClients = [];

const broadcastToAdmins = (data) => {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  adminClients.forEach(client => client.write(message));
};

// GET /api/config
router.get('/config', (req, res) => {
  const config = db.prepare('SELECT * FROM quiz_config WHERE id = 1').get();
  res.json(config);
});

// POST /api/participants
router.post('/participants', (req, res) => {
  const { name, email, team } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Insert or return existing
  try {
    const existing = db.prepare('SELECT id FROM participants WHERE email = ?').get(email);
    if (existing) {
      return res.json({ id: existing.id });
    }

    const result = db.prepare('INSERT INTO participants (name, email, team) VALUES (?, ?, ?)')
      .run(name, email, team || null);
    
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/attempts/start
router.post('/attempts/start', (req, res) => {
  const { participant_id } = req.body;
  if (!participant_id) return res.status(400).json({ error: 'participant_id required' });

  const config = db.prepare('SELECT questions_per_attempt FROM quiz_config WHERE id = 1').get();
  const allQuestions = getQuestions();
  
  // Randomly select N questions
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, config.questions_per_attempt);
  const selectedIds = selected.map(q => q.id);

  const result = db.prepare(`
    INSERT INTO attempts (participant_id, started_at, status, assigned_question_ids) 
    VALUES (?, datetime('now'), 'in_progress', ?)
  `).run(participant_id, JSON.stringify(selectedIds));

  // Strip answers
  const clientQuestions = selected.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options
  }));

  res.json({ 
    attempt_id: result.lastInsertRowid,
    questions: clientQuestions
  });
});

// GET /api/attempts/:id
router.get('/attempts/:id', (req, res) => {
  const attempt = db.prepare('SELECT * FROM attempts WHERE id = ?').get(req.params.id);
  
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  
  const assignedIds = JSON.parse(attempt.assigned_question_ids);
  const allQuestions = getQuestions();
  
  // Reconstruct questions in order
  const clientQuestions = assignedIds.map(id => {
    const q = allQuestions.find(q => q.id === id);
    return {
      id: q.id,
      text: q.text,
      options: q.options
    };
  });

  res.json({ 
    attempt_id: attempt.id,
    status: attempt.status,
    questions: clientQuestions,
    score: attempt.score
  });
});

// POST /api/attempts/:id/submit
router.post('/attempts/:id/submit', (req, res) => {
  const attemptId = req.params.id;
  const { answers } = req.body; // Array of { questionId, selectedOptionIndex }

  const attempt = db.prepare('SELECT * FROM attempts WHERE id = ? AND status = \'in_progress\'').get(attemptId);
  if (!attempt) return res.status(400).json({ error: 'Invalid or already submitted attempt' });

  const allQuestions = getQuestions();
  let score = 0;

  const insertAnswer = db.prepare(`
    INSERT INTO answers (attempt_id, question_id, selected_option_index, is_correct)
    VALUES (?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const ans of answers) {
      const q = allQuestions.find(q => q.id === ans.questionId);
      if (!q) continue;

      const isCorrect = q.correctAnswerIndex === ans.selectedOptionIndex;
      if (isCorrect) score += 1;

      insertAnswer.run(attemptId, ans.questionId, ans.selectedOptionIndex, isCorrect ? 1 : 0);
    }

    db.prepare(`
      UPDATE attempts 
      SET status = 'completed', 
          submitted_at = datetime('now'),
          score = ?,
          elapsed_seconds = CAST((julianday('now') - julianday(started_at)) * 86400 AS INTEGER)
      WHERE id = ?
    `).run(score, attemptId);
  })();

  res.json({ score });

  // After successful submission, broadcast to SSE clients
  try {
    const completedAttempt = db.prepare(`
      SELECT a.id, p.name, p.email, a.started_at, a.submitted_at, a.elapsed_seconds, a.score, a.status
      FROM attempts a
      JOIN participants p ON a.participant_id = p.id
      WHERE a.id = ?
    `).get(attemptId);
    
    if (completedAttempt) {
      broadcastToAdmins(completedAttempt);
    }
  } catch (err) {
    console.error('Failed to broadcast SSE', err);
  }
});

// ADMIN ROUTES
router.get('/admin/attempts', (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, p.name, p.email, a.started_at, a.submitted_at, a.elapsed_seconds, a.score, a.status
    FROM attempts a
    JOIN participants p ON a.participant_id = p.id
    ORDER BY a.started_at DESC
  `).all();
  res.json(rows);
});

router.get('/admin/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  adminClients.push(res);

  req.on('close', () => {
    adminClients = adminClients.filter(client => client !== res);
  });
});

export default router;
