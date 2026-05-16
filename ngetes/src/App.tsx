import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore } from './store/useAppStore';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WorkerListScreen } from './screens/WorkerListScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RegisterWorkerScreen } from './screens/RegisterWorkerScreen';
import { StatusReviewScreen } from './screens/StatusReviewScreen';

export default function App() {
  const { isSplashVisible, currentScreen } = useAppStore();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
      <AnimatePresence>
        {isSplashVisible && <SplashScreen />}
      </AnimatePresence>

      <main className="max-w-screen-sm mx-auto bg-white min-h-screen shadow-2xl relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeScreen />
            </motion.div>
          )}

          {currentScreen === 'worker-list' && (
            <motion.div
              key="worker-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <WorkerListScreen />
            </motion.div>
          )}

          {currentScreen === 'worker-profile' && (
            <motion.div
              key="worker-profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProfileScreen />
            </motion.div>
          )}

          {currentScreen === 'register-worker' && (
            <motion.div
              key="register-worker"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <RegisterWorkerScreen />
            </motion.div>
          )}

          {currentScreen === 'status-review' && (
            <motion.div
              key="status-review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StatusReviewScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
