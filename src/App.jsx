import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import FlashcardPage from './components/FlashcardPage'
import InputPage from './components/InputPage'
import QuizPage from './components/QuizPage'
import LibraryPage from './components/LibraryPage'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const addFlashcards = (newFlashcards) => {
    setFlashcards(prev => [...prev, ...newFlashcards])
  }

  const addQuizQuestions = (newQuestions) => {
    setQuizQuestions(prev => [...prev, ...newQuestions])
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <Router>
      <div className="header">
        <nav className="nav">
          <Link to="/" className="nav-brand" onClick={closeMobileMenu}>Ashley's Flashcards</Link>
          
          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>Flashcards</Link>
            <Link to="/input" className="nav-link" onClick={closeMobileMenu}>Create Flashcards</Link>
            <Link to="/quiz" className="nav-link" onClick={closeMobileMenu}>Take Quiz</Link>
            <Link to="/library" className="nav-link" onClick={closeMobileMenu}>My Library</Link>
          </div>

          {/* Mobile Navigation Overlay */}
          <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}>
            <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-links">
                <Link to="/" className="nav-link mobile-nav-link" onClick={closeMobileMenu}>Flashcards</Link>
                <Link to="/input" className="nav-link mobile-nav-link" onClick={closeMobileMenu}>Create Flashcards</Link>
                <Link to="/quiz" className="nav-link mobile-nav-link" onClick={closeMobileMenu}>Take Quiz</Link>
                <Link to="/library" className="nav-link mobile-nav-link" onClick={closeMobileMenu}>My Library</Link>
              </div>
            </div>
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
