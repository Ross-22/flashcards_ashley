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
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    if (location.state && location.state.questions) {
      console.log('Questions from location state:', location.state.questions);
      setDisplayQuestions(location.state.questions);
      setQuizStarted(true);
    } else if (questions && questions.length > 0) {
      console.log('Questions from props:', questions);
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
    console.log('Current question:', currentQuestion);
    console.log('Selected option index:', selectedOption);
    console.log('Correct answer string:', currentQuestion.correctAnswer);
    
    // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
    const correctAnswerIndex = currentQuestion.correctAnswer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    console.log('Correct answer index:', correctAnswerIndex);
    
    // Track user's answer
    const userAnswer = {
      questionIndex: currentQuestionIndex,
      selectedOption: selectedOption,
      correctAnswerIndex: correctAnswerIndex,
      isCorrect: selectedOption === correctAnswerIndex
    };
    
    setUserAnswers(prev => [...prev, userAnswer]);
    
    if (selectedOption === correctAnswerIndex) {
      console.log('Answer is correct!');
      setScore(prev => prev + 1);
    } else {
      console.log('Answer is incorrect. Selected:', selectedOption, 'Correct:', correctAnswerIndex);
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
    setUserAnswers([]);
    setQuizStarted(true);
  };

  if (!quizStarted || displayQuestions.length === 0) {
    return (
      <div>
        <div className="hero">
          <h1 className="hero-title">Quiz</h1>
          <p className="hero-subtitle">Test your knowledge with interactive quizzes</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">No Quiz Available</h2>
            <p className="card-subtitle">Get started by creating quiz questions</p>
          </div>
          <p>Go to the "Create Flashcards" page to add some quiz questions!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Quiz</h1>
        <p className="hero-subtitle">Test your knowledge with interactive quizzes</p>
      </div>

      {!showResults ? (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Question {currentQuestionIndex + 1} of {displayQuestions.length}</h2>
            <p className="card-subtitle">Select the correct answer</p>
          </div>
          
          <div className="quiz-question">
            <div className="quiz-question-header">
              <div className="quiz-question-number">Question {currentQuestionIndex + 1}</div>
              <h3 className="quiz-question-text">{displayQuestions[currentQuestionIndex].question}</h3>
            </div>
            
            <div className="quiz-options">
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
          </div>

          {selectedOption !== null && (
            <div className="controls">
              <button className="btn btn-lg" onClick={handleNextQuestion}>
                {currentQuestionIndex + 1 < displayQuestions.length ? 'Next Question →' : 'Show Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quiz Results</h2>
              <p className="card-subtitle">Great job completing the quiz!</p>
            </div>
            
            <div className="score-display">
              {score} / {displayQuestions.length}
            </div>
            
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
              You answered {score} out of {displayQuestions.length} questions correctly
            </p>
            
            <div className="controls">
              <button className="btn btn-lg" onClick={handleRestartQuiz}>
                Restart Quiz
              </button>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
              <h2 className="card-title">Question Review</h2>
              <p className="card-subtitle">See which questions you got right and wrong</p>
            </div>
            
            <div className="quiz-review">
              {displayQuestions.map((question, index) => {
                const userAnswer = userAnswers.find(answer => answer.questionIndex === index);
                const isCorrect = userAnswer?.isCorrect || false;
                const selectedOptionIndex = userAnswer?.selectedOption;
                const correctAnswerIndex = userAnswer?.correctAnswerIndex;
                
                return (
                  <div key={index} className="quiz-review-item">
                    <div className="quiz-review-header">
                      <div className="quiz-review-number">Question {index + 1}</div>
                      <div className={`quiz-review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    </div>
                    
                    <h3 className="quiz-review-question">{question.question}</h3>
                    
                    <div className="quiz-review-options">
                      {question.options.map((option, optionIndex) => {
                        let optionClass = 'quiz-review-option';
                        if (optionIndex === correctAnswerIndex) {
                          optionClass += ' correct-answer';
                        }
                        if (optionIndex === selectedOptionIndex) {
                          optionClass += ' user-answer';
                        }
                        
                        return (
                          <div key={optionIndex} className={optionClass}>
                            <div className="quiz-review-option-content">
                              <span className="quiz-review-option-letter">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className="quiz-review-option-text">{option}</span>
                            </div>
                            {optionIndex === correctAnswerIndex && (
                              <div className="quiz-review-option-label">Correct Answer</div>
                            )}
                            {optionIndex === selectedOptionIndex && optionIndex !== correctAnswerIndex && (
                              <div className="quiz-review-option-label">Your Answer</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
