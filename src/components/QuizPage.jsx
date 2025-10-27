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
}
