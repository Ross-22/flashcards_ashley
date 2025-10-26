import React, { useState } from 'react'
import { saveFlashcards, saveQuiz } from '../services/firestoreService'

const InputPage = ({ onAddFlashcards, onAddQuizQuestions }) => {
  const [lessonText, setLessonText] = useState('')
  const [flashcardCount, setFlashcardCount] = useState(5)
  const [quizQuestionCount, setQuizQuestionCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [summary, setSummary] = useState('')
  const [keyConcepts, setKeyConcepts] = useState([])

  // Deepseek API configuration
  const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
  const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

  // Function to call Deepseek AI to generate flashcards and quiz questions
  const generateFlashcardsFromText = async (text, flashcardCount, quizQuestionCount) => {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('Deepseek API key not configured. Please check your environment variables.')
    }

    const prompt = `
You are an expert educational content creator and summarizer. Please analyze the following lesson text and:

1. FIRST, create a comprehensive summary that captures the main ideas and key concepts
2. THEN, identify the 5 most important key concepts from the text
3. FINALLY, generate flashcards and quiz questions based on the summary and key concepts

IMPORTANT: Do NOT simply copy and paste text from the original lesson. Instead:
- Synthesize and summarize the information
- Extract the most important concepts
- Create original questions that test understanding of the summarized concepts

For the summary:
- Create a concise but comprehensive overview (2-3 paragraphs)
- Focus on the main ideas, not minor details
- Use your own words to explain the concepts

For key concepts:
- Identify the 5 most important ideas, principles, or terms
- Provide a brief explanation for each concept
- Focus on concepts that are central to understanding the material

For flashcards:
- Create exactly ${flashcardCount} flashcards that test understanding of the summarized concepts
- Use different question types: definition, application, comparison, analysis
- Provide answers that explain the concepts clearly
- Do NOT copy text directly from the original lesson

For quiz questions:
- Create exactly ${quizQuestionCount} quiz questions based on the key concepts and summary
- Use varied phrasing and question formats
- Ensure options are plausible but clearly distinguishable
- Focus on testing conceptual understanding

Lesson text: "${text}"

Please respond with a JSON object in this exact format:
{
  "summary": "Comprehensive summary of the lesson text in 2-3 paragraphs...",
  "keyConcepts": [
    {
      "concept": "Concept name",
      "explanation": "Brief explanation of the concept"
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "question": "Question text here",
      "answer": "Answer text here"
    }
  ],
  "quizQuestions": [
    {
      "id": 1,
      "question": "Quiz question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A"
    }
  ]
}
`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 5000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error Response:', errorData)
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Deepseek API key in the .env file.')
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.')
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Please check your API key permissions.')
      } else {
        throw new Error(`API request failed with status ${response.status}: ${errorData}`)
      }
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    
    console.log('Raw AI response:', content)
    
    // Parse the JSON response from the AI
    try {
      const parsedContent = JSON.parse(content)
      console.log('Successfully parsed AI response:', parsedContent)
      return parsedContent
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      console.error('Parse error:', parseError)
      
      // Try to extract JSON from the response if it's wrapped in markdown
      try {
        // Look for JSON between ```json and ``` markers
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
          console.log('Found JSON in markdown, attempting to parse...')
          const parsedContent = JSON.parse(jsonMatch[1])
          console.log('Successfully parsed JSON from markdown:', parsedContent)
          return parsedContent
        }
        
        // Try to find JSON object directly
        const jsonObjectMatch = content.match(/\{[\s\S]*\}/)
        if (jsonObjectMatch) {
          console.log('Found JSON object, attempting to parse...')
          const parsedContent = JSON.parse(jsonObjectMatch[0])
          console.log('Successfully parsed JSON object:', parsedContent)
          return parsedContent
        }
      } catch (secondParseError) {
        console.error('Second parse attempt failed:', secondParseError)
        console.error('Error details:', secondParseError.message)
        console.error('Error position:', secondParseError.position)
      }
      
      throw new Error('Failed to parse AI response. The AI may have returned invalid JSON. Please try again with different text or adjust the number of flashcards/quiz questions.')
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!lessonText.trim()) {
      setError('Please enter some lesson text')
      return
    }

    // Validate counts
    const validFlashcardCounts = [3, 5, 10, 15]
    const validQuizCounts = [3, 5, 10, 15]
    
    if (!validFlashcardCounts.includes(flashcardCount)) {
      setError('Please select a valid number of flashcards')
      return
    }
    if (!validQuizCounts.includes(quizQuestionCount)) {
      setError('Please select a valid number of quiz questions')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')
    setSummary('')
    setKeyConcepts([])

    try {
      console.log('Using AI to generate flashcards...')
      const result = await generateFlashcardsFromText(lessonText, flashcardCount, quizQuestionCount)
      console.log('AI generation successful')
      
      const { summary, keyConcepts, flashcards, quizQuestions } = result
      
      // Validate that we got the expected data
      if (!flashcards || !Array.isArray(flashcards)) {
        throw new Error('AI did not generate valid flashcards. Please try again.')
      }
      
      if (!quizQuestions || !Array.isArray(quizQuestions)) {
        throw new Error('AI did not generate valid quiz questions. Please try again.')
      }
      
      // Store summary and key concepts for display
      if (summary) setSummary(summary)
      if (keyConcepts) setKeyConcepts(keyConcepts)
      
      // Add unique IDs to ensure they're properly tracked
      const flashcardsWithIds = flashcards.map((flashcard, index) => ({
        ...flashcard,
        id: Date.now() + index
      }))
      
      const quizQuestionsWithIds = quizQuestions.map((question, index) => ({
        ...question,
        id: Date.now() + index + 1000
      }))
      
      // Save to Firestore
      await saveFlashcards(flashcardsWithIds, summary, keyConcepts)
      await saveQuiz(quizQuestionsWithIds, summary, keyConcepts)
      
      onAddFlashcards(flashcardsWithIds)
      onAddQuizQuestions(quizQuestionsWithIds)
      
      setSuccess(`Successfully created ${flashcardsWithIds.length} flashcards and ${quizQuestionsWithIds.length} quiz questions using AI analysis! All content has been saved to your library.`)
      setLessonText('')
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      setError(err.message || 'Failed to generate flashcards. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">Create Flashcards</h1>
        <p className="hero-subtitle">Transform any lesson text into interactive learning materials with AI</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generate Learning Materials</h2>
          <p className="card-subtitle">Enter your lesson text below. Our AI will extract the most important concepts and create flashcards automatically.</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lessonText">Lesson Text:</label>
            <textarea
              id="lessonText"
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              placeholder="Paste your lesson text here. For example: 'Photosynthesis is the process by which plants convert light energy into chemical energy...'"
              disabled={isLoading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="flashcardCount">Number of Flashcards:</label>
              <select
                id="flashcardCount"
                value={flashcardCount}
                onChange={(e) => setFlashcardCount(parseInt(e.target.value))}
                disabled={isLoading}
              >
                <option value={3}>3 (Quick Practice)</option>
                <option value={5}>5 (Standard)</option>
                <option value={10}>10 (Comprehensive)</option>
                <option value={15}>15 (In-depth)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quizQuestionCount">Number of Quiz Questions:</label>
              <select
                id="quizQuestionCount"
                value={quizQuestionCount}
                onChange={(e) => setQuizQuestionCount(parseInt(e.target.value))}
                disabled={isLoading}
              >
                <option value={3}>3 (Quick Test)</option>
                <option value={5}>5 (Standard)</option>
                <option value={10}>10 (Comprehensive)</option>
                <option value={15}>15 (In-depth)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-lg" 
            disabled={isLoading || !lessonText.trim()}
          >
            {isLoading ? '🔄 Generating Flashcards...' : '🚀 Generate Flashcards & Quiz'}
          </button>
        </form>

        {isLoading && (
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <p>Analyzing your lesson text and generating flashcards...</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>This may take a few seconds.</p>
          </div>
        )}

        {/* Display Summary and Key Concepts */}
        {summary && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
              <h3 className="card-title">📝 Summary</h3>
            </div>
            <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{summary}</p>
          </div>
        )}

        {keyConcepts.length > 0 && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h3 className="card-title">🔑 Key Concepts</h3>
            </div>
            <div className="grid">
              {keyConcepts.map((concept, index) => (
                <div key={index} className="card" style={{ padding: '1rem', background: 'var(--secondary-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{concept.concept}</h4>
                  <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-light)' }}>{concept.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ marginTop: '2rem', background: 'var(--secondary-color)' }}>
          <div className="card-header">
            <h3 className="card-title">How it works:</h3>
          </div>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6', color: 'var(--text-light)' }}>
            <li>Enter any lesson text or study material</li>
            <li>Our AI analyzes the text and identifies key concepts</li>
            <li>Creates interactive flashcards with questions and answers</li>
            <li>Generates quiz questions for additional practice</li>
            <li>All content is saved and available in the Flashcards and Quiz sections</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InputPage
