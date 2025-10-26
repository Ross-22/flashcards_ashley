import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import FlashcardPage from './components/FlashcardPage'
import InputPage from './components/InputPage'
import QuizPage from './components/QuizPage'
import LibraryPage from './components/LibraryPage'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])

  const addFlashcards = (newFlashcards) => {
    setFlashcards(prev => [...prev, ...newFlashcards])
  }

  const addQuizQuestions = (newQuestions) => {
    setQuizQuestions(prev => [...prev, ...newQuestions])
  }

  return (
    <Router>
      <div className="header">
        <nav className="nav">
          <Link to="/" className="nav-brand">Ashley Flashcards</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Flashcards</Link>
            <Link to="/input" className="nav-link">Create Flashcards</Link>
            <Link to="/quiz" className="nav-link">Take Quiz</Link>
            <Link to="/library" className="nav-link">My Library</Link>
          </div>
        </nav>
      </div>

      <div className="container">
        <Routes>
          <Route 
            path="/" 
            element={<FlashcardPage flashcards={flashcards} />} 
          />
          <Route 
            path="/input" 
            element={
              <InputPage 
                onAddFlashcards={addFlashcards}
                onAddQuizQuestions={addQuizQuestions}
              />
            } 
          />
          <Route 
            path="/quiz" 
            element={<QuizPage questions={quizQuestions} />} 
          />
          <Route 
            path="/library" 
            element={<LibraryPage />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
