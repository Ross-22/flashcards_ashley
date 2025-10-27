import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate for potential navigation

const QuizPage = ({ questions }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState([]); // Initialize as empty array

  useEffect(() => {
    // Check if questions were passed via navigation state
    if (location.state && location.state.questions) {
      setDisplayQuestions(location.state.questions);
      setQuizStarted(true); // Assume quiz starts if questions are provided
    } else if (questions && questions.length > 0) {
      setDisplayQuestions(questions);
      setQuizStarted(true); // Assume quiz starts if questions are provided via prop
    } else {
      // If no questions are available, maybe navigate back or show a message
      console.error("No questions available for the quiz.");
      // Optionally navigate back to a previous page or show an error message
      // navigate('/some-fallback-page');
    }
  }, [location.state, questions, navigate]); // Added navigate to dependency array

<<<<<<< HEAD
  const handleOptionSelect = (optionIndex) => {
    if (showResults) return
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return

    // Convert the correct answer letter (A, B, C, D) to an index (0, 1, 2, 3)
    const correctAnswerIndex = currentQuestion.correctAnswer.charCodeAt(0) - 65 // A=0, B=1, C=2, D=3
    
    if (selectedOption === correctAnswerIndex) {
      setScore(prev => prev + 1)
=======
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const isCorrect = displayQuestions[currentQuestionIndex].correctAnswer === selectedOption;
    if (isCorrect) {
      setScore(score + 1);
>>>>>>> 496d616b8cb4c226950cfba6d40e7ce358799200
    }

    setSelectedOption(null); // Reset selection for the next question

    if (currentQuestionIndex + 1 < displayQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true); // End of quiz, show results
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setQuizStarted(true); // Ensure quiz is marked as started
    // If questions were loaded from state, they should still be there.
    // If they were from props and might change, you might need to re-fetch or re-initialize.
  };

  if (!quizStarted || displayQuestions.length === 0) {
    return <div>Loading quiz... or no questions available.</div>; // Or navigate away
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
<<<<<<< HEAD
                className={`quiz-option ${
                  selectedOption === index ? 'selected' : ''
                }`}
                onClick={() => handleOptionSelect(index)}
=======
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
>>>>>>> 496d616b8cb4c226950cfba6d40e7ce358799200
              >
                {option}
              </button>
            ))}
          </div>
          {selectedOption && (
            <button onClick={handleNextQuestion}>
              {currentQuestionIndex + 1 < displayQuestions.length ? 'Next Question' : 'Show Results'}
            </button>
          )}
        </div>
<<<<<<< HEAD

      </div>
=======
      ) : (
        <div className="results-container">
          <h2>Quiz Results</h2>
          <p>Your score: {score} out of {displayQuestions.length}</p>
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
          {/* Optionally, add a button to go back to the library or home */}
          {/* <button onClick={() => navigate('/library')}>Go to Library</button> */}
        </div>
      )}
>>>>>>> 496d616b8cb4c226950cfba6d40e7ce358799200
    </div>
  );
};

export default QuizPage;
