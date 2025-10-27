import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizPage = ({ questions }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState([]);

  useEffect(() => {
    if (location.state && location.state.questions) {
      setDisplayQuestions(location.state.questions);
      setQuizStarted(true);
    } else if (questions && questions.length > 0) {
      setDisplayQuestions(questions);
      setQuizStarted(true);
    } else {
      console.error("No questions available for the quiz.");
    }
  }, [location.state, questions]);

  const handleOptionSelect = (optionIndex) => {
    if (showResults) return;
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const currentQuestion = displayQuestions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.correctAnswer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    
    if (selectedOption === correctAnswerIndex) {
      setScore(prev => prev + 1);
    }

    setSelectedOption(null);

    if (currentQuestionIndex + 1 < displayQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setQuizStarted(true);
  };

  if (!quizStarted || displayQuestions.length === 0) {
    return <div>Loading quiz... or no questions available.</div>;
  }

  return (
    <div className="quiz-container">
      {!showResults ? (
        <div>
          <h2>Question {currentQuestionIndex + 1} of {displayQuestions.length}</h2>
          <p>{displayQuestions[currentQuestionIndex].question}</p>
          <div className="options-container">
            {displayQuestions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${
                  selectedOption === index ? 'selected' : ''
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedOption !== null && (
            <button onClick={handleNextQuestion}>
              {currentQuestionIndex + 1 < displayQuestions.length ? 'Next Question' : 'Show Results'}
            </button>
          )}
        </div>
      ) : (
        <div className="results-container">
          <h2>Quiz Results</h2>
          <p>Your score: {score} out of {displayQuestions.length}</p>
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
