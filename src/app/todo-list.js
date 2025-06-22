"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Check, X, Edit3 } from "lucide-react"

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState("")

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        createdAt: new Date().toLocaleTimeString(),
      }
      setTodos([newTodo, ...todos])
      setInputValue("")
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditValue(text)
  }

  const saveEdit = (id) => {
    if (editValue.trim()) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editValue.trim() } : todo)))
    }
    setEditingId(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id)
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  return (
    <div className="min-h-screen bg-background-black p-6 pt-10 container-mobile">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionProps}
          className="text-center mb-12 animate-slide-up"
        >
          <h1 className="text-white text-4xl font-semibold mb-4">My Todo List</h1>
          <p className="text-zinc-400 text-lg">
            {todos.length === 0 ? "No tasks yet. Add one below!" : `${todos.length} tasks`}
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionProps, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative glass-effect rounded-2xl">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="w-full bg-transparent border border-zinc-800 rounded-2xl px-6 py-4 pr-16 text-white placeholder-zinc-500 text-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-primary-orange transition-all duration-200"
            />
            <motion.button
              onClick={addTodo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-orange hover:bg-primary-orange-hover text-dark-brown p-3 rounded-xl transition-colors duration-200"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>

        {/* Table Display Area */}
        <div className="overflow-x-auto">
          <table className="w-full glass-effect rounded-2xl border border-zinc-800">
            <thead>
              <tr className="bg-zinc-900/50 text-left text-zinc-400">
                <th className="px-6 py-4 font-semibold text-lg">Task</th>
                <th className="px-6 py-4 font-semibold text-lg">Description</th>
                <th className="px-6 py-4 font-semibold text-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {todos.map((todo, index) => (
                  <motion.tr
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ ...transitionProps, delay: index * 0.05 }}
                    className="border-t border-zinc-800 hover:bg-zinc-900-alpha-hover"
                  >
                    <td className="px-6 py-4">
                      {editingId === todo.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                            onBlur={() => saveEdit(todo.id)}
                            autoFocus
                            className="w-full bg-transparent text-white text-lg border-none outline-none focus:ring-0 p-0"
                          />
                          <motion.button
                            onClick={() => saveEdit(todo.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-primary-orange hover:bg-primary-orange/10 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={cancelEdit}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-zinc-500 hover:bg-zinc-800 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white text-lg">{todo.text}</span>
                          <motion.button
                            onClick={() => startEdit(todo.id, todo.text)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-zinc-500 hover:text-primary-orange hover:bg-primary-orange/10 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-lg">{todo.text}</td>
                    <td className="px-6 py-4">
                      <motion.button
                        onClick={() => deleteTodo(todo.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 glass-effect rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-xl mb-2">No tasks yet</p>
            <p className="text-zinc-600">Add your first task above to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}