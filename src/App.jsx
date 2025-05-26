import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import { getIcon } from './utils/iconUtils'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const SunIcon = getIcon('sun')
  const MoonIcon = getIcon('moon')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              {darkMode ? (
                <span className="text-2xl">✨</span>
              ) : (
                <span className="text-2xl">📋</span>
              )}
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">Tasker Ultra Pro Max</h1>



          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? 
              <SunIcon className="h-5 w-5 text-yellow-400" /> : 
              <MoonIcon className="h-5 w-5 text-surface-600" />
            }
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-100"
      />
    </div>
  )
}

export default App