import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

const MainFeature = ({ onAddTask, projects = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    status: 'not-started',
    priority: 'medium',
    projectId: projects.length > 0 ? projects[0].id : ''
  })
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)

  // Icon components
  const PlusIcon = getIcon('plus')
  const CheckCircleIcon = getIcon('check-circle')
  const XIcon = getIcon('x')
  const AlertCircleIcon = getIcon('alert-circle')
  const ArrowRightIcon = getIcon('arrow-right')
  const ArrowLeftIcon = getIcon('arrow-left')
  const CalendarIcon = getIcon('calendar')
  const TagIcon = getIcon('tag')
  const ClipboardIcon = getIcon('clipboard')
  const LayersIcon = getIcon('layers')
  const FlagIcon = getIcon('flag')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTask({ ...task, [name]: value })
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!task.title.trim()) {
        newErrors.title = "Title is required"
      }
      
      if (!task.projectId) {
        newErrors.projectId = "Please select a project"
      }
    }
    
    if (step === 2) {
      if (!task.dueDate) {
        newErrors.dueDate = "Due date is required"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateStep(currentStep)) {
      onAddTask(task)
      resetForm()
    }
  }

  const resetForm = () => {
    setTask({
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'not-started',
      priority: 'medium',
      projectId: projects.length > 0 ? projects[0].id : ''
    })
    setErrors({})
    setCurrentStep(1)
    setIsOpen(false)
  }

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const stepVariants = {
    hidden: (direction) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: (direction) => {
      return {
        x: direction > 0 ? -100 : 100,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  }

  // Custom form elements
  const FormField = ({ label, error, children }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
        {label}
      </label>
      {children}
      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <AlertCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )

  // Steps content
  const Step1Content = () => (
    <div>
      <FormField label="Task Title" error={errors.title}>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleInputChange}
          placeholder="What needs to be done?"
          className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
          autoFocus
        />
      </FormField>
      
      <FormField label="Project" error={errors.projectId}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {projects.map(project => (
            <div key={project.id}>
              <input
                type="radio"
                id={`project-${project.id}`}
                name="projectId"
                value={project.id}
                checked={task.projectId === project.id}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <label
                htmlFor={`project-${project.id}`}
                className="flex items-center p-3 border-2 rounded-lg cursor-pointer
                  border-surface-200 dark:border-surface-700 
                  peer-checked:border-primary peer-checked:bg-primary/10
                  hover:bg-surface-50 dark:hover:bg-surface-800 transition-all"
                style={{ borderLeftWidth: '6px', borderLeftColor: project.color }}
              >
                <span className="font-medium">{project.name}</span>
              </label>
            </div>
          ))}
        </div>
      </FormField>
      
      <FormField label="Description">
        <textarea
          name="description"
          value={task.description}
          onChange={handleInputChange}
          placeholder="Add details about this task..."
          className="input-field min-h-[100px]"
        />
      </FormField>
    </div>
  )

  const Step2Content = () => (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium text-lg text-surface-800 dark:text-surface-200">Set Task Parameters</h3>
          <p className="text-surface-500 dark:text-surface-400 text-sm">Define when and how this task should be completed</p>
        </div>
      </div>
      
      <FormField label="Due Date" error={errors.dueDate}>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleInputChange}
          className={`input-field ${errors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
        />
      </FormField>
      
      <FormField label="Priority Level">
        <div className="grid grid-cols-3 gap-2">
          {['low', 'medium', 'high'].map(priority => (
            <div key={priority}>
              <input
                type="radio"
                id={`priority-${priority}`}
                name="priority"
                value={priority}
                checked={task.priority === priority}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <label
                htmlFor={`priority-${priority}`}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer
                  border-surface-200 dark:border-surface-700 
                  peer-checked:border-primary peer-checked:bg-primary/10
                  hover:bg-surface-50 dark:hover:bg-surface-800 transition-all text-center`}
              >
                <FlagIcon className={`h-5 w-5 mb-1 ${
                  priority === 'low' ? 'text-green-500' : 
                  priority === 'medium' ? 'text-yellow-500' : 
                  'text-red-500'
                }`} />
                <span className="font-medium capitalize">{priority}</span>
              </label>
            </div>
          ))}
        </div>
      </FormField>
      
      <FormField label="Initial Status">
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'not-started', label: 'Not Started', icon: ClipboardIcon },
            { id: 'in-progress', label: 'In Progress', icon: LayersIcon },
            { id: 'completed', label: 'Completed', icon: CheckCircleIcon }
          ].map(status => {
            const StatusIcon = status.icon
            return (
              <div key={status.id}>
                <input
                  type="radio"
                  id={`status-${status.id}`}
                  name="status"
                  value={status.id}
                  checked={task.status === status.id}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <label
                  htmlFor={`status-${status.id}`}
                  className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer
                    border-surface-200 dark:border-surface-700 
                    peer-checked:border-primary peer-checked:bg-primary/10
                    hover:bg-surface-50 dark:hover:bg-surface-800 transition-all text-center"
                >
                  <StatusIcon className="h-5 w-5 mb-1 text-primary" />
                  <span className="font-medium text-sm">{status.label}</span>
                </label>
              </div>
            )
          })}
        </div>
      </FormField>
    </div>
  )

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="neu-card p-8 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <PlusIcon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold mb-1 text-center md:text-left">Create New Task</h3>
            <p className="text-surface-600 dark:text-surface-300 text-center md:text-left">
              Add a new task to your workflow and stay organized
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={resetForm}
            />
            
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white dark:bg-surface-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
                  <h2 className="text-xl font-bold">
                    {currentStep === 1 ? 'Create New Task' : 'Task Details'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-surface-500 hover:text-surface-800 dark:hover:text-white p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="p-6 overflow-auto max-h-[70vh]">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex space-x-2">
                        {[1, 2].map(step => (
                          <div 
                            key={step}
                            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                              ${currentStep === step 
                                ? 'bg-primary text-white' 
                                : currentStep > step 
                                  ? 'bg-primary/20 text-primary border border-primary' 
                                  : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                              }`}
                            onClick={() => {
                              if (currentStep > step || (step === 2 && validateStep(1))) {
                                setCurrentStep(step)
                              }
                            }}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm text-surface-500 dark:text-surface-400">
                        Step {currentStep} of 2
                      </div>
                    </div>
                    
                    <AnimatePresence mode="wait" custom={currentStep}>
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          custom={currentStep}
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Step1Content />
                        </motion.div>
                      )}
                      
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          custom={currentStep}
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Step2Content />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="border-t border-surface-200 dark:border-surface-700 p-4 flex justify-between">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-1 px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    {currentStep < 2 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                      >
                        Next
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Create Task
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MainFeature