import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllFlashcards, 
  getAllQuizzes, 
  deleteFlashcardSet, 
  deleteQuiz, 
  updateFlashcardSet, 
  updateQuiz 
} from '../services/firestoreService';

const LibraryPage = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('flashcards');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      const [flashcardsData, quizzesData] = await Promise.all([
        getAllFlashcards(),
        getAllQuizzes()
      ]);
      
      setFlashcards(flashcardsData);
      setQuizzes(quizzesData);
    } catch (err) {
      console.error('Error loading library data:', err);
      setError('Failed to load saved content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleFlashcardSelection = (setId) => {
    setSelectedFlashcards(prev => 
      prev.includes(setId) 
        ? prev.filter(id => id !== setId)
        : [...prev, setId]
    );
  };

  const toggleQuizSelection = (quizId) => {
    setSelectedQuizzes(prev => 
      prev.includes(quizId) 
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  };

  const useSelectedFlashcards = () => {
    if (selectedFlashcards.length === 0) {
      alert('Please select at least one flashcard set to use.');
      return;
    }
    
    // For now, we'll use the first selected set
    // In a more advanced implementation, we could merge multiple sets
    const selectedSet = flashcards.find(set => set.id === selectedFlashcards[0]);
    if (selectedSet) {
      // Navigate to flashcards page with the selected set
      navigate('/', { state: { flashcards: selectedSet.flashcards } });
    }
  };

  const useSelectedQuizzes = () => {
    if (selectedQuizzes.length === 0) {
      alert('Please select at least one quiz to use.');
      return;
    }
    
    // For now, we'll use the first selected quiz
    const selectedQuiz = quizzes.find(quiz => quiz.id === selectedQuizzes[0]);
    if (selectedQuiz) {
      // Navigate to quiz page with the selected quiz
      navigate('/quiz', { state: { questions: selectedQuiz.questions } });
    }
  };

  const clearSelections = () => {
    setSelectedFlashcards([]);
    setSelectedQuizzes([]);
  };

  // Delete functions
  const handleDeleteFlashcardSet = async (setId, event) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this flashcard set? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteFlashcardSet(setId);
      setFlashcards(prev => prev.filter(set => set.id !== setId));
      setSelectedFlashcards(prev => prev.filter(id => id !== setId));
    } catch (err) {
      console.error('Error deleting flashcard set:', err);
      setError('Failed to delete flashcard set. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId, event) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      setSelectedQuizzes(prev => prev.filter(id => id !== quizId));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Rename functions
  const startEditing = (itemId, currentText, type, event) => {
    event.stopPropagation();
    setEditingItem({ id: itemId, type });
    setEditText(currentText || '');
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditText('');
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      alert('Please enter a valid name.');
      return;
    }

    try {
      setActionLoading(true);
      const { id, type } = editingItem;
      
      if (type === 'flashcard') {
        await updateFlashcardSet(id, { summary: editText.trim() });
        setFlashcards(prev => 
          prev.map(set => 
            set.id === id ? { ...set, summary: editText.trim() } : set
          )
        );
      } else if (type === 'quiz') {
        await updateQuiz(id, { summary: editText.trim() });
        setQuizzes(prev => 
          prev.map(quiz => 
            quiz.id === id ? { ...quiz, summary: editText.trim() } : quiz
          )
        );
      }
      
      cancelEditing();
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="hero">
          <h1 className="hero-title">My Library</h1>
          <p className="hero-subtitle">Browse your saved flashcards and quizzes</p>
        </div>
        <div className="card">
          <div className="loading">
            <p>Loading your saved content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">My Library</h1>
        <p className="hero-subtitle">Browse your saved flashcards and quizzes</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'flashcards' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            📚 Flashcards ({flashcards.length})
          </button>
          <button
            className={`tab ${activeTab === 'quizzes' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            🎯 Quizzes ({quizzes.length})
          </button>
        </div>

        {/* Selection Controls */}
        {(selectedFlashcards.length > 0 || selectedQuizzes.length > 0) && (
          <div className="selection-controls">
            <div className="selection-controls-info">
              <strong>Selected: </strong>
              {activeTab === 'flashcards' && `${selectedFlashcards.length} flashcard set(s)`}
              {activeTab === 'quizzes' && `${selectedQuizzes.length} quiz(zes)`}
            </div>
            <div className="selection-controls-actions">
              {activeTab === 'flashcards' && (
                <button 
                  className="button button-primary"
                  onClick={useSelectedFlashcards}
                >
                  Use Selected Flashcards
                </button>
              )}
              {activeTab === 'quizzes' && (
                <button 
                  className="button button-primary"
                  onClick={useSelectedQuizzes}
                >
                  Use Selected Quiz
                </button>
              )}
              <button 
                className="button button-secondary"
                onClick={clearSelections}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="library-content">
            {flashcards.length === 0 ? (
              <div className="empty-state">
                <h3>No flashcards yet</h3>
                <p>Create your first set of flashcards to see them here!</p>
              </div>
            ) : (
              <div className="grid">
                {flashcards.map((set) => (
                  <div 
                    key={set.id} 
                    className={`card library-item ${selectedFlashcards.includes(set.id) ? 'selected' : ''}`}
                    onClick={() => toggleFlashcardSelection(set.id)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div 
                      className="selection-indicator"
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid var(--primary-color)',
                        background: selectedFlashcards.includes(set.id) ? 'var(--primary-color)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    >
                      {selectedFlashcards.includes(set.id) && '✓'}
                    </div>
                    <div className="library-item-header">
                      {editingItem && editingItem.id === set.id && editingItem.type === 'flashcard' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              fontSize: '1rem',
                              width: '100%'
                            }}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="button button-primary"
                              onClick={saveEdit}
                              disabled={actionLoading}
                              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                            >
                              Save
                            </button>
                            <button 
                              className="button button-secondary"
                              onClick={cancelEditing}
                              disabled={actionLoading}
                              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <h3 className="library-item-title">
                          {set.summary ? truncateText(set.summary, 50) : 'Flashcard Set'}
                        </h3>
                      )}
                      <span className="library-item-count">
                        {set.totalFlashcards || set.flashcards?.length || 0} cards
                      </span>
                    </div>
                    
                    {set.summary && (
                      <p className="library-item-description">
                        {truncateText(set.summary)}
                      </p>
                    )}
                    
                    {set.keyConcepts && set.keyConcepts.length > 0 && (
                      <div className="library-item-concepts">
                        <strong>Key Concepts:</strong>
                        <div className="concepts-list">
                          {set.keyConcepts.slice(0, 3).map((concept, index) => (
                            <span key={index} className="concept-tag">
                              {concept.concept}
                            </span>
                          ))}
                          {set.keyConcepts.length > 3 && (
                            <span className="concept-tag">
                              +{set.keyConcepts.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    {(!editingItem || editingItem.id !== set.id) && (
                      <div className="library-item-actions" style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        marginTop: '1rem',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          className="button button-secondary"
                          onClick={(e) => startEditing(set.id, set.summary, 'flashcard', e)}
                          disabled={actionLoading}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          ✏️ Rename
                        </button>
                        <button
                          className="button button-danger"
                          onClick={(e) => handleDeleteFlashcardSet(set.id, e)}
                          disabled={actionLoading}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}

                    <div className="library-item-footer">
                      <span className="library-item-date">
                        Created: {formatDate(set.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="library-content">
            {quizzes.length === 0 ? (
              <div className="empty-state">
                <h3>No quizzes yet</h3>
                <p>Create your first quiz to see it here!</p>
              </div>
            ) : (
              <div className="grid">
                {quizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className={`card library-item ${selectedQuizzes.includes(quiz.id) ? 'selected' : ''}`}
                    onClick={() => toggleQuizSelection(quiz.id)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div 
                      className="selection-indicator"
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid var(--primary-color)',
                        background: selectedQuizzes.includes(quiz.id) ? 'var(--primary-color)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    >
                      {selectedQuizzes.includes(quiz.id) && '✓'}
                    </div>
                    <div className="library-item-header">
                      {editingItem && editingItem.id === quiz.id && editingItem.type === 'quiz' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              fontSize: '1rem',
                              width: '100%'
                            }}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="button button-primary"
                              onClick={saveEdit}
                              disabled={actionLoading}
                              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                            >
                              Save
                            </button>
                            <button 
                              className="button button-secondary"
                              onClick={cancelEditing}
                              disabled={actionLoading}
                              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <h3 className="library-item-title">
                          {quiz.summary ? truncateText(quiz.summary, 50) : 'Quiz'}
                        </h3>
                      )}
                      <span className="library-item-count">
                        {quiz.totalQuestions || quiz.questions?.length || 0} questions
                      </span>
                    </div>
                    
                    {quiz.summary && (
                      <p className="library-item-description">
                        {truncateText(quiz.summary)}
                      </p>
                    )}
                    
                    {quiz.keyConcepts && quiz.keyConcepts.length > 0 && (
                      <div className="library-item-concepts">
                        <strong>Key Concepts:</strong>
                        <div className="concepts-list">
                          {quiz.keyConcepts.slice(0, 3).map((concept, index) => (
                            <span key={index} className="concept-tag">
                              {concept.concept}
                            </span>
                          ))}
                          {quiz.keyConcepts.length > 3 && (
                            <span className="concept-tag">
                              +{quiz.keyConcepts.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    {(!editingItem || editingItem.id !== quiz.id) && (
                      <div className="library-item-actions" style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        marginTop: '1rem',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          className="button button-secondary"
                          onClick={(e) => startEditing(quiz.id, quiz.summary, 'quiz', e)}
                          disabled={actionLoading}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          ✏️ Rename
                        </button>
                        <button
                          className="button button-danger"
                          onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                          disabled={actionLoading}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}

                    <div className="library-item-footer">
                      <span className="library-item-date">
                        Created: {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--secondary-color)' }}>
        <div className="card-header">
          <h3 className="card-title">About Your Library</h3>
        </div>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6', color: 'var(--text-light)' }}>
          <li>All flashcards and quizzes you create are automatically saved here</li>
          <li>Browse your saved content anytime to review and study</li>
          <li>Each set includes the original summary and key concepts</li>
          <li>Content is stored securely in the cloud</li>
        </ul>
      </div>
    </div>
  );
};

export default LibraryPage;
