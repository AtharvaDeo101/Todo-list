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
        completed: false,
        createdAt: new Date().toLocaleTimeString(),
      }
      setTodos([newTodo, ...todos])
      setInputValue("")
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
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

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-black p-6 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionProps}
          className="text-center mb-12"
        >
          <h1 className="text-white text-4xl font-semibold mb-4">My Todo List</h1>
          <p className="text-zinc-400 text-lg">
            {totalCount === 0 ? "No tasks yet. Add one below!" : `${completedCount} of ${totalCount} tasks completed`}
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionProps, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 pr-16 text-white placeholder-zinc-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#ff9066]/50 focus:border-[#ff9066]/50 transition-all duration-200"
            />
            <motion.button
              onClick={addTodo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ff9066] hover:bg-[#ff7a4d] text-[#2a1711] p-3 rounded-xl transition-colors duration-200"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>

        {/* Display Area */}
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  ...transitionProps,
                  delay: index * 0.05,
                }}
                className={`
                  group relative bg-zinc-900/30 backdrop-blur-sm border rounded-2xl p-6
                  transition-all duration-300 hover:bg-zinc-900/50
                  ${todo.completed ? "border-[#ff9066]/30 bg-[#2a1711]/20" : "border-zinc-800 hover:border-zinc-700"}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => toggleTodo(todo.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1
                      transition-all duration-200
                      ${todo.completed ? "bg-[#ff9066] border-[#ff9066]" : "border-zinc-600 hover:border-[#ff9066]/50"}
                    `}
                  >
                    <AnimatePresence>
                      {todo.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={transitionProps}
                        >
                          <Check className="w-4 h-4 text-[#2a1711]" strokeWidth={2.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                        onBlur={() => saveEdit(todo.id)}
                        autoFocus
                        className="w-full bg-transparent text-white text-lg border-none outline-none focus:ring-0 p-0"
                      />
                    ) : (
                      <motion.p
                        layout
                        className={`
                          text-lg leading-relaxed transition-all duration-200
                          ${todo.completed ? "text-zinc-500 line-through" : "text-white"}
                        `}
                      >
                        {todo.text}
                      </motion.p>
                    )}
                    <p className="text-zinc-600 text-sm mt-2">Added at {todo.createdAt}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {editingId === todo.id ? (
                      <>
                        <motion.button
                          onClick={() => saveEdit(todo.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-[#ff9066] hover:bg-[#ff9066]/10 rounded-lg transition-colors duration-200"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={cancelEdit}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => startEdit(todo.id, todo.text)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-zinc-500 hover:text-[#ff9066] hover:bg-[#ff9066]/10 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteTodo(todo.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-zinc-900/50 rounded-full flex items-center justify-center">
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