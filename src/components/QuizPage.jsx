import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const QuizPage = ({ questions }) => {
  const location = useLocation()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [displayQuestions, setDisplayQuestions] = useState(questions)

  useEffect(() => {
    // Check if questions were passed via navigation state
    if (location.state && location.state.questions) {
      setDisplayQuestions(location.state.questions)
    } else {
      setDisplayQuestions(questions)
    }
  }, [location.state, questions])

  if (displayQuestions.length === 0) {
    return (
      <div>
        <div className="hero">
          <h1 className="hero-title">Quiz</h1>
          <p className="hero-subtitle">Test your knowledge with interactive quizzes generated from your flashcards</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">No Quiz Questions Available</h2>
            <p className="card-subtitle">Get started by creating flashcards first</p>
          </div>
          <p>Go to the "Create Flashcards" page to generate some quiz questions first!</p>
        </div>
      </div>
    )
  }

  const currentQuestion = displayQuestions[currentQuestionIndex]

  const handleOptionSelect = (option) => {
    if (showResults) return
    setSelectedOption(option)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }

    if (currentQuestionIndex < displayQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
    } else {
      setShowResults(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setScore(0)
    setShowResults(false)
    setQuizStarted(false)
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  if (!quizStarted) {
    return (
      <div>
        <div className="hero">
          <h1 className="hero-title">Quiz</h1>
          <p className="hero-subtitle">Test your knowledge with interactive quizzes generated from your flashcards</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Interactive Quiz</h2>
            <p className="card-subtitle">Test your knowledge with {displayQuestions.length} questions generated from your flashcards.</p>
          </div>
          <div className="quiz-question">
            <div className="quiz-question-header">
              <div className="quiz-question-number">Instructions</div>
              <h3 className="quiz-question-text">How to take the quiz</h3>
            </div>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6', color: 'var(--text-light)' }}>
              <li>Read each question carefully</li>
              <li>Select the correct answer from the options</li>
              <li>You'll see your score at the end</li>
              <li>You can restart the quiz anytime</li>
            </ul>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn btn-lg" onClick={handleStartQuiz}>
                🚀 Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const percentage = Math.round((score / displayQuestions.length) * 100)
    return (
      <div>
        <div className="hero">
          <h1 className="hero-title">Quiz Results</h1>
          <p className="hero-subtitle">See how well you performed on the quiz</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Performance</h2>
          </div>
          <div className="score-display">
            {score} / {displayQuestions.length} ({percentage}%)
          </div>
          
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            {percentage >= 80 && <p style={{ color: 'var(--accent-color)', fontSize: '1.25rem', fontWeight: '600' }}>Excellent! 🎉</p>}
            {percentage >= 60 && percentage < 80 && <p style={{ color: '#ffc107', fontSize: '1.25rem', fontWeight: '600' }}>Good job! 👍</p>}
            {percentage < 60 && <p style={{ color: '#dc3545', fontSize: '1.25rem', fontWeight: '600' }}>Keep practicing! 📚</p>}
          </div>

          <div className="quiz-question">
            <div className="quiz-question-header">
              <h3 className="quiz-question-text">Question Review</h3>
            </div>
            {displayQuestions.map((question, index) => (
              <div key={question.id} className="card" style={{ marginBottom: '1rem', padding: '1.5rem', background: 'var(--secondary-color)' }}>
                <p><strong>Q{index + 1}:</strong> {question.question}</p>
                <p style={{ marginTop: '0.5rem', color: 'var(--primary-color)' }}><strong>Correct Answer:</strong> {question.correctAnswer}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-lg" onClick={handleRestartQuiz}>
              🔄 Restart Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Quiz</h1>
        <p className="hero-subtitle">Test your knowledge with interactive quizzes</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Interactive Quiz</h2>
          <p className="card-subtitle">Question {currentQuestionIndex + 1} of {displayQuestions.length}</p>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / displayQuestions.length) * 100}%` }}
          ></div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Progress: {currentQuestionIndex + 1} of {displayQuestions.length}
          </div>
        </div>

        <div className="quiz-question">
          <div className="quiz-question-header">
            <div className="quiz-question-number">Question {currentQuestionIndex + 1}</div>
            <h3 className="quiz-question-text">{currentQuestion.question}</h3>
          </div>
          
          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`quiz-option ${
                  selectedOption === option ? 'selected' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="btn btn-lg" 
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
            >
              {currentQuestionIndex < displayQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz 🏁'}
            </button>
          </div>
        </div>

        <div className="score-display">
          Current Score: {score} / {currentQuestionIndex}
        </div>
      </div>
    </div>
  )
}

export default QuizPage
