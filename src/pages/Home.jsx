import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { getIcon } from '../utils/iconUtils'
import MainFeature from '../components/MainFeature'

// Sample projects data
const initialProjects = [
  { id: "p1", name: "Work", color: "#3b82f6", tasks: [] },
  { id: "p2", name: "Personal", color: "#8b5cf6", tasks: [] },
  { id: "p3", name: "Learning", color: "#f59e0b", tasks: [] }
]

// Sample tasks data
const initialTasks = [
  {
    id: "t1",
    title: "Complete project proposal",
    description: "Draft the initial proposal for the new client project",
    status: "in-progress",
    priority: "high",
    projectId: "p1",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "t2",
    title: "Grocery shopping",
    description: "Buy vegetables, fruits, and other essentials",
    status: "not-started",
    priority: "medium",
    projectId: "p2",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "t3",
    title: "Learn React advanced patterns",
    description: "Study compound components and context API",
    status: "not-started",
    priority: "low",
    projectId: "p3",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "t4",
    title: "Weekly team meeting",
    description: "Discuss project progress and next steps",
    status: "completed",
    priority: "high",
    projectId: "p1",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
]

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    return savedTasks ? JSON.parse(savedTasks) : initialTasks
  })
  
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('taskflow-projects')
    return savedProjects ? JSON.parse(savedProjects) : initialProjects
  })
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeProject, setActiveProject] = useState('all')

  // Save to localStorage whenever tasks or projects change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    localStorage.setItem('taskflow-projects', JSON.stringify(projects))
  }, [tasks, projects])

  // Function to add a task
  const addTask = (newTask) => {
    const taskWithDefaults = {
      ...newTask,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: newTask.status || 'not-started'
    }
    
    setTasks([...tasks, taskWithDefaults])
    toast.success("Task created successfully!")
  }

  // Function to update a task
  const updateTask = (taskId, updatedFields) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedFields } : task
    ))
    toast.success("Task updated successfully!")
  }

  // Function to delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success("Task deleted successfully!")
  }

  // Filter tasks based on active filter and project
  const filteredTasks = tasks.filter(task => {
    const statusMatch = activeFilter === 'all' || task.status === activeFilter
    const projectMatch = activeProject === 'all' || task.projectId === activeProject
    return statusMatch && projectMatch
  })

  // Get project color by id
  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project?.color || "#94a3b8"
  }

  // Get project name by id
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || "No Project"
  }

  // Icon components
  const ClipboardListIcon = getIcon('clipboard-list')
  const FilterIcon = getIcon('filter')
  const CheckCircleIcon = getIcon('check-circle')
  const CircleIcon = getIcon('circle')
  const Clock3Icon = getIcon('clock-3')
  const XIcon = getIcon('x')
  const PencilIcon = getIcon('pencil')
  const TrashIcon = getIcon('trash')
  const AlertTriangleIcon = getIcon('alert-triangle')
  
  // Status badges
  const statusBadges = {
    'not-started': { label: 'Not Started', icon: CircleIcon, className: 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300' },
    'in-progress': { label: 'In Progress', icon: Clock3Icon, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    'completed': { label: 'Completed', icon: CheckCircleIcon, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
  }

  // Priority badges
  const priorityBadges = {
    'low': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
    'medium': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    'high': { className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
  }

  // Task card component
  const TaskCard = ({ task }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState(task)

    const status = statusBadges[task.status]
    const priority = priorityBadges[task.priority]
    const StatusIcon = status.icon
    const projectColor = getProjectColor(task.projectId)
    
    const handleCancel = () => {
      setIsEditing(false)
      setEditedTask(task)
    }
    
    const handleSave = () => {
      updateTask(task.id, editedTask)
      setIsEditing(false)
    }
    
    const toggleStatus = () => {
      const statusOrder = ['not-started', 'in-progress', 'completed']
      const currentIndex = statusOrder.indexOf(task.status)
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
      updateTask(task.id, { status: nextStatus })
    }
    
    // Format due date
    const formatDueDate = (dateString) => {
      return format(new Date(dateString), 'MMM d, yyyy')
    }


    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="card overflow-hidden"
        style={{ borderLeft: `4px solid ${projectColor}` }}
      >
        {isEditing ? (
          <div className="p-4">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">Title</label>
              <input 
                type="text" 
                className="input-field"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">Description</label>
              <textarea
                className="input-field min-h-[80px]"
                value={editedTask.description}
                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">Due Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={new Date(editedTask.dueDate).toISOString().split('T')[0]}
                  onChange={(e) => setEditedTask({
                    ...editedTask, 
                    dueDate: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">Project</label>
                <select
                  className="input-field"
                  value={editedTask.projectId}
                  onChange={(e) => setEditedTask({...editedTask, projectId: e.target.value})}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">Status</label>
                <select
                  className="input-field"
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">Priority</label>
                <select
                  className="input-field"
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                className="btn bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 flex justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium text-lg ${task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''}`}>
                    {task.title}
                  </h3>
                  <button 
                    onClick={toggleStatus}
                    className="ml-2 p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                  >
                    <StatusIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                  
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.className}`}
                  >
                    Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${projectColor}20`, color: projectColor }}
                  >
                    {getProjectName(task.projectId)}
                  </span>
                </div>
                
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-surface-600 dark:text-surface-300"
                  >
                    <p>{task.description}</p>
                    
                    <div className="mt-3 text-sm text-surface-500 dark:text-surface-400">
                      Due: {formatDueDate(task.dueDate)}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-1 py-2 px-4 text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="py-2 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-l border-surface-200 dark:border-surface-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="py-2 px-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-l border-surface-200 dark:border-surface-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    )
  }

  // Stats card
  const TaskStatsCard = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length
    const notStartedTasks = tasks.filter(t => t.status === 'not-started').length
    
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    return (
      <div className="bg-gradient-to-br from-primary/90 to-secondary/90 text-white rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Task Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{totalTasks}</div>
            <div className="text-sm text-white/80">Total Tasks</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-sm text-white/80">Completed</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <div className="text-sm text-white/80">In Progress</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{notStartedTasks}</div>
            <div className="text-sm text-white/80">Not Started</div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <TaskStatsCard />
      
      <MainFeature onAddTask={addTask} projects={projects} />
      
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ClipboardListIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Your Tasks</h2>
            <span className="text-sm bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full">
              {filteredTasks.length}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
              <FilterIcon className="h-4 w-4 text-surface-500 dark:text-surface-400 ml-2" />
              <select
                className="bg-transparent border-none text-sm font-medium focus:outline-none py-1 pl-1 pr-6"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
              <select
                className="bg-transparent border-none text-sm font-medium focus:outline-none py-1 px-3"
                value={activeProject}
                onChange={(e) => setActiveProject(e.target.value)}
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-50 dark:bg-surface-800 rounded-xl border border-dashed border-surface-200 dark:border-surface-700">
            <AlertTriangleIcon className="h-10 w-10 text-surface-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-1">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400">
              Try changing the filters or add a new task.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
