import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const FlashcardPage = ({ flashcards }) => {
  const location = useLocation()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [displayFlashcards, setDisplayFlashcards] = useState(flashcards)

  useEffect(() => {
    // Check if flashcards were passed via navigation state
    if (location.state && location.state.flashcards) {
      setDisplayFlashcards(location.state.flashcards)
    } else {
      setDisplayFlashcards(flashcards)
    }
  }, [location.state, flashcards])

  if (displayFlashcards.length === 0) {
    return (
      <div>
        <div className="hero">
          <h1 className="hero-title">Flashcards</h1>
          <p className="hero-subtitle">Create interactive flashcards to enhance your learning experience</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">No Flashcards Available</h2>
            <p className="card-subtitle">Get started by creating your first set of flashcards</p>
          </div>
          <p>Go to the "Create Flashcards" page to add some flashcards!</p>
        </div>
      </div>
    )
  }

  const currentCard = displayFlashcards[currentCardIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev + 1) % displayFlashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev - 1 + displayFlashcards.length) % displayFlashcards.length)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Flashcards</h1>
        <p className="hero-subtitle">Master your knowledge with interactive flashcards</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Study Session</h2>
          <p className="card-subtitle">Click on the flashcard to flip it and reveal the answer</p>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentCardIndex + 1) / displayFlashcards.length) * 100}%` }}
          ></div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Card {currentCardIndex + 1} of {displayFlashcards.length}
          </div>
        </div>

        <div className="flashcard-container">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-front">
              {currentCard.question}
            </div>
            <div className="flashcard-back">
              {currentCard.answer}
            </div>
            <div className="flashcard-hint">
              Click to flip
            </div>
          </div>
        </div>

        <div className="controls">
          <button className="btn btn-secondary" onClick={handlePrevious}>
            ← Previous
          </button>
          <button className="btn" onClick={handleNext}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlashcardPage
