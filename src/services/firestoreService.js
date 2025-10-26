import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection names
const FLASHCARDS_COLLECTION = 'flashcards';
const QUIZZES_COLLECTION = 'quizzes';

// Save flashcards to Firestore
export const saveFlashcards = async (flashcards, summary = '', keyConcepts = []) => {
  try {
    const flashcardsData = {
      flashcards: flashcards,
      summary: summary,
      keyConcepts: keyConcepts,
      createdAt: Timestamp.now(),
      totalFlashcards: flashcards.length
    };

    const docRef = await addDoc(collection(db, FLASHCARDS_COLLECTION), flashcardsData);
    console.log('Flashcards saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving flashcards: ', error);
    throw error;
  }
};

// Save quiz to Firestore
export const saveQuiz = async (quizQuestions, summary = '', keyConcepts = []) => {
  try {
    const quizData = {
      questions: quizQuestions,
      summary: summary,
      keyConcepts: keyConcepts,
      createdAt: Timestamp.now(),
      totalQuestions: quizQuestions.length
    };

    const docRef = await addDoc(collection(db, QUIZZES_COLLECTION), quizData);
    console.log('Quiz saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz: ', error);
    throw error;
  }
};

// Get all saved flashcards sets
export const getAllFlashcards = async () => {
  try {
    const q = query(collection(db, FLASHCARDS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const flashcardsSets = [];
    querySnapshot.forEach((doc) => {
      flashcardsSets.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return flashcardsSets;
  } catch (error) {
    console.error('Error getting flashcards: ', error);
    throw error;
  }
};

// Get all saved quizzes
export const getAllQuizzes = async () => {
  try {
    const q = query(collection(db, QUIZZES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const quizzes = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return quizzes;
  } catch (error) {
    console.error('Error getting quizzes: ', error);
    throw error;
  }
};

// Get a specific flashcard set by ID
export const getFlashcardSet = async (setId) => {
  try {
    const q = query(collection(db, FLASHCARDS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    let flashcardSet = null;
    querySnapshot.forEach((doc) => {
      if (doc.id === setId) {
        flashcardSet = {
          id: doc.id,
          ...doc.data()
        };
      }
    });
    
    return flashcardSet;
  } catch (error) {
    console.error('Error getting flashcard set: ', error);
    throw error;
  }
};

// Get a specific quiz by ID
export const getQuiz = async (quizId) => {
  try {
    const q = query(collection(db, QUIZZES_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    let quiz = null;
    querySnapshot.forEach((doc) => {
      if (doc.id === quizId) {
        quiz = {
          id: doc.id,
          ...doc.data()
        };
      }
    });
    
    return quiz;
  } catch (error) {
    console.error('Error getting quiz: ', error);
    throw error;
  }
};

// Delete a flashcard set
export const deleteFlashcardSet = async (setId) => {
  try {
    await deleteDoc(doc(db, FLASHCARDS_COLLECTION, setId));
    console.log('Flashcard set deleted with ID: ', setId);
    return true;
  } catch (error) {
    console.error('Error deleting flashcard set: ', error);
    throw error;
  }
};

// Delete a quiz
export const deleteQuiz = async (quizId) => {
  try {
    await deleteDoc(doc(db, QUIZZES_COLLECTION, quizId));
    console.log('Quiz deleted with ID: ', quizId);
    return true;
  } catch (error) {
    console.error('Error deleting quiz: ', error);
    throw error;
  }
};

// Update flashcard set summary
export const updateFlashcardSet = async (setId, updates) => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, setId);
    await updateDoc(flashcardRef, updates);
    console.log('Flashcard set updated with ID: ', setId);
    return true;
  } catch (error) {
    console.error('Error updating flashcard set: ', error);
    throw error;
  }
};

// Update quiz summary
export const updateQuiz = async (quizId, updates) => {
  try {
    const quizRef = doc(db, QUIZZES_COLLECTION, quizId);
    await updateDoc(quizRef, updates);
    console.log('Quiz updated with ID: ', quizId);
    return true;
  } catch (error) {
    console.error('Error updating quiz: ', error);
    throw error;
  }
};
