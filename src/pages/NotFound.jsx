import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

const NotFound = () => {
  const HomeIcon = getIcon('home')
  const AlertTriangleIcon = getIcon('alert-triangle')

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AlertTriangleIcon className="h-20 w-20 text-accent mb-6" />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-3 text-center text-surface-800 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      
      <motion.p
        className="text-xl md:text-2xl font-semibold mb-2 text-center text-surface-600 dark:text-surface-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Page Not Found
      </motion.p>
      
      <motion.p
        className="text-surface-500 dark:text-surface-400 max-w-md text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link 
          to="/"
          className="btn btn-primary flex items-center gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          Go Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound