/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen, Goal, UserProfile } from './types';
import WelcomeScreen from './screens/WelcomeScreen';
import PathScreen from './screens/PathScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import QuizScreen from './screens/QuizScreen';
import GoalsScreen from './screens/GoalsScreen';
import ProfileScreen from './screens/ProfileScreen';
import WritingScreen from './screens/WritingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { audioService } from './services/audioService';
import { auth, db, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const INITIAL_GOALS: Goal[] = [
  { id: 'lessons', title: 'Complete Lessons', target: 2, current: 1, icon: '📚' },
  { id: 'flashcards', title: 'Practice Flashcards', target: 10, current: 4, icon: '🎴' },
  { id: 'quiz', title: 'Perfect Quizzes', target: 1, current: 0, icon: '✨' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [hearts, setHearts] = useState(5);
  const [isInfiniteHearts, setIsInfiniteHearts] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Sakura Learner',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hmaI445ZqO4evqDvsgCo6t_6u60g1NZCzXjRr21BqzHr2Pe3-Tccs-iwvfpFO0G7iU-FdvcrmkxftzTzMv6xt8OdYjzeQsE9TZWnUXXoZZuZejGbBoS411qYZ_VKpYI_fWjB02IHDj5vh-4Jtewh6vwrOUhL3H3HvP_vFQ3q54h1Z4nkDz50zfnajcml_bDgbp1VbOYDHaO6wpyUmASG96FMd_ypxSDucGOMuiRszpa0-rgFBbam8PdZDy1I2EDywGv-mYzEduRg',
    gender: 'female'
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Sync with Firestore
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Initial fetch or setup
    const setupUser = async () => {
      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          // New user who just logged in: Go to onboarding
          setCurrentScreen(Screen.ONBOARDING);
          setIsLoading(false);
        } else {
          const data = snap.data();
          if (data.name && data.gender) {
             setCurrentScreen(Screen.PATH);
          } else {
             setCurrentScreen(Screen.ONBOARDING);
          }
          setIsLoading(false);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        setIsLoading(false);
      }
    };

    setupUser();

    // Listen for changes
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGoals(data.goals || INITIAL_GOALS);
        setHearts(data.hearts ?? 5);
        setUnlockedLevels(data.unlockedLevels || 1);
        setIsInfiniteHearts(data.isInfiniteHearts ?? false);
        setUserProfile({
          name: data.name || 'Sakura Learner',
          avatar: data.avatar || userProfile.avatar,
          gender: data.gender || 'female'
        });
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Apply Theme Colors
  useEffect(() => {
    const root = document.documentElement;
    if (userProfile.gender === 'male') {
      root.style.setProperty('--color-primary', '#3b82f6');
      root.style.setProperty('--color-primary-container', '#eff6ff');
      document.body.style.backgroundColor = '#f8fafc';
    } else {
      root.style.setProperty('--color-primary', '#ff8fa3');
      root.style.setProperty('--color-primary-container', '#fff5f7');
      document.body.style.backgroundColor = '#f8f9fa';
    }
  }, [userProfile.gender]);

  // Persist changes to Firestore
  const syncToFirestore = async (updates: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleOnboardingComplete = async (data: { name: string, gender: 'female' | 'male' }) => {
    if (!user) return;
    const initialData = {
      uid: user.uid,
      name: data.name,
      gender: data.gender,
      avatar: user.photoURL || userProfile.avatar,
      hearts: 5,
      isInfiniteHearts: false,
      unlockedLevels: 1,
      goals: INITIAL_GOALS,
      updatedAt: serverTimestamp()
    };
    try {
      await setDoc(doc(db, 'users', user.uid), initialData);
      setUserProfile(prev => ({ ...prev, ...data }));
      setCurrentScreen(Screen.PATH);
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  // Refill hearts every minute (Local only, then sync)
  useEffect(() => {
    if (hearts >= 5 || isInfiniteHearts) return;
    
    const interval = setInterval(() => {
      const newHearts = Math.min(5, hearts + 1);
      setHearts(newHearts);
      syncToFirestore({ hearts: newHearts });
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, [hearts, isInfiniteHearts, user]);

  const updateGoalProgress = (goalId: string, amount: number = 1) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.target, goal.current + amount);
        if (newCurrent >= goal.target && goal.current < goal.target) {
          audioService.playComplete();
        }
        return { ...goal, current: newCurrent };
      }
      return goal;
    });
    setGoals(updatedGoals);
    syncToFirestore({ goals: updatedGoals });
  };

  if (isLoading && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          🌸
        </motion.div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.WELCOME:
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen 
              onStart={async () => {
                if (!user) {
                  try {
                    await signInWithGoogle();
                  } catch (e) {
                    console.error("Sign in failed", e);
                  }
                } else {
                  // User already exists, check if onboarded
                  const snap = await getDoc(doc(db, 'users', user.uid));
                  if (snap.exists() && snap.data().gender) {
                    setCurrentScreen(Screen.PATH);
                  } else {
                    setCurrentScreen(Screen.ONBOARDING);
                  }
                }
              }} 
              isLoggedIn={!!user}
            />
          </motion.div>
        );
      case Screen.ONBOARDING:
        return (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          </motion.div>
        );
      case Screen.PATH:
        return (
          <motion.div
            key="path"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <PathScreen 
              onStartLesson={() => setCurrentScreen(Screen.FLASHCARD)} 
              onNavigate={(s) => setCurrentScreen(s)}
              userProfile={userProfile}
              hearts={hearts}
              isInfiniteHearts={isInfiniteHearts}
              unlockedLevels={unlockedLevels}
            />
          </motion.div>
        );
      case Screen.FLASHCARD:
        return (
          <motion.div
            key="flashcard"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardScreen 
              onClose={() => setCurrentScreen(Screen.PATH)} 
              onNext={() => {
                updateGoalProgress('flashcards', 1);
                setCurrentScreen(Screen.QUIZ);
              }} 
            />
          </motion.div>
        );
      case Screen.QUIZ:
        return (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
          >
            <QuizScreen 
              onClose={() => setCurrentScreen(Screen.PATH)} 
              hearts={hearts}
              isInfiniteHearts={isInfiniteHearts}
              onLoseHeart={() => {
                if (!isInfiniteHearts) {
                  const newHearts = Math.max(0, hearts - 1);
                  setHearts(newHearts);
                  syncToFirestore({ hearts: newHearts });
                }
              }}
              onFinish={() => {
                updateGoalProgress('lessons', 1);
                updateGoalProgress('quiz', 1);
                const nextLevel = Math.max(unlockedLevels, unlockedLevels + 1); // Simple increment for now, but usually levels are linear
                setUnlockedLevels(nextLevel);
                syncToFirestore({ unlockedLevels: nextLevel });
                setCurrentScreen(Screen.GOALS);
              }} 
            />
          </motion.div>
        );
      case Screen.GOALS:
        return (
          <motion.div
            key="goals"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <GoalsScreen 
              goals={goals} 
              onNavigate={(s) => setCurrentScreen(s)} 
            />
          </motion.div>
        );
      case Screen.PROFILE:
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileScreen 
              onNavigate={(s) => setCurrentScreen(s)} 
              userProfile={userProfile}
              onUpdateProfile={(updates) => {
                const newProfile = { ...userProfile, ...updates };
                setUserProfile(newProfile);
                syncToFirestore(updates);
              }}
              isInfiniteHearts={isInfiniteHearts}
              onToggleInfiniteHearts={() => {
                const newState = !isInfiniteHearts;
                setIsInfiniteHearts(newState);
                syncToFirestore({ isInfiniteHearts: newState });
              }}
              onLogout={() => {
                auth.signOut();
                setCurrentScreen(Screen.WELCOME);
                setUser(null);
              }}
            />
          </motion.div>
        );
      case Screen.WRITING:
        return (
          <motion.div
            key="writing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <WritingScreen onNavigate={(s) => setCurrentScreen(s)} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative font-sans antialiased">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
}
