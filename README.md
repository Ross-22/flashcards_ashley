# Ashley Flashcards - Interactive Study Website

A React-based flashcard application that helps with studying by automatically generating flashcards and quiz questions from lesson text using AI-powered analysis.

## Features

### 🎴 Main Flashcard Page
- Interactive flashcard display with flip animation
- Navigation controls (Previous/Next)
- Progress tracking
- Clean, modern UI with hover effects

### 📝 Data Input Page
- Text area for entering lesson content
- AI-powered analysis to extract key concepts
- Automatic generation of flashcards and quiz questions
- Loading states and error handling
- Success feedback

### 🎯 Interactive Quiz Area
- Multiple-choice questions generated from lesson content
- Scoring system with percentage calculation
- Progress tracking during quiz
- Question review after completion
- Performance feedback (Excellent/Good/Keep Practicing)

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern gradients and animations

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000/`

## How to Use

1. **Create Flashcards**:
   - Go to the "Create Flashcards" page
   - Paste your lesson text in the text area
   - Click "Generate Flashcards & Quiz"
   - Wait for the AI to analyze and create content

2. **Study with Flashcards**:
   - Navigate to the main "Flashcards" page
   - Click on flashcards to flip them
   - Use Previous/Next buttons to navigate

3. **Test Knowledge with Quiz**:
   - Go to the "Take Quiz" page
   - Click "Start Quiz"
   - Answer multiple-choice questions
   - Review your score and performance

## AI Integration

The application now integrates with **Deepseek AI** to provide intelligent flashcard and quiz generation:

### Setting up Deepseek AI

1. **Get API Key**:
   - Visit [Deepseek Platform](https://platform.deepseek.com/)
   - Create an account and get your API key

2. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Replace `your_deepseek_api_key_here` with your actual API key:
   ```
   VITE_DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
   ```

3. **Restart Development Server**:
   - Stop the current server (`Ctrl+C`)
   - Run `npm run dev` again

### AI Features

- **Intelligent Analysis**: Deepseek AI analyzes lesson text to identify key concepts
- **Quality Flashcards**: Generates meaningful questions and comprehensive answers
- **Smart Quiz Questions**: Creates relevant multiple-choice questions with proper options
- **Educational Focus**: Tailored specifically for learning and knowledge retention

## Project Structure

```
src/
├── components/
│   ├── FlashcardPage.jsx    # Main flashcard display
│   ├── InputPage.jsx        # Lesson input and AI generation
│   └── QuizPage.jsx         # Interactive quiz
├── App.jsx                  # Main app with routing
├── main.jsx                 # React entry point
└── index.css               # Global styles
```

## Customization

You can easily customize:
- Color schemes in `src/index.css`
- AI generation logic in `InputPage.jsx`
- Quiz question formats in the quiz generation functions
- Flashcard styling and animations

## Future Enhancements

- Integration with real AI APIs (OpenAI, etc.)
- User accounts and data persistence
- Multiple flashcard sets
- Export/import functionality
- Mobile app version
