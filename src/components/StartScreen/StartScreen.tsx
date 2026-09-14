import React, { useState } from 'react';
import { Button } from '../Button/Button';
import './StartScreen.css';

interface StartScreenProps {
  onStart: (name: string, email: string) => void;
  totalQuestions: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, totalQuestions }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onStart(name, email);
    }
  };

  return (
    <div className="start-screen">
      <h1>Antigravity Training Quiz</h1>
      <p>Test your knowledge with this {totalQuestions || 20}-question quiz.</p>
      
      <form onSubmit={handleSubmit} className="start-form">
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <div className="start-action">
          <Button type="submit" fullWidth>Start Quiz</Button>
        </div>
      </form>
    </div>
  );
};
