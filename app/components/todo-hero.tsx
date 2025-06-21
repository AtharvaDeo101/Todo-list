"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export type FilterType = "all" | "active" | "completed"

export default function TodoHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [text, setText] = useState("")

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 60

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const addTodo = (todoText: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: todoText,
      completed: false,
      createdAt: new Date(),
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo(text.trim())
      setText("")
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const activeTodosCount = todos.filter((todo) => !todo.completed).length
  const completedTodosCount = todos.filter((todo) => todo.completed).length

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
        {/* Title Section */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-4 text-6xl font-bold tracking-tighter sm:text-7xl lg:text-8xl">TODO</h1>
          <p className="text-lg text-gray-400 sm:text-xl">Organize your life, one task at a time</p>
        </motion.div>

        {/* Todo Interface */}
        <motion.div
          className="w-full max-w-2xl space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Add Todo Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-zinc-800/80 backdrop-blur-sm border-zinc-700 text-white placeholder:text-gray-400 h-12 text-lg"
            />
            <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 h-12 w-12">
              <Plus className="h-5 w-5" />
            </Button>
          </form>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 bg-zinc-900/50 backdrop-blur-sm rounded-lg p-3">
            <span>{activeTodosCount} active tasks</span>
            <span>{completedTodosCount} completed tasks</span>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex gap-2">
              {filters.map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                  className={
                    filter === filterOption.key
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-zinc-700 text-gray-400 hover:text-white bg-transparent"
                  }
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>

            {completedTodosCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCompleted} className="text-gray-400 hover:text-red-400">
                Clear completed
              </Button>
            )}
          </div>

          {/* Todo List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 p-4 bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-zinc-700"
                  whileHover={{ scale: 1.01 }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <span className={`flex-1 ${todo.completed ? "text-gray-500 line-through" : "text-white"}`}>
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {todos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 bg-zinc-900/30 backdrop-blur-sm rounded-lg"
            >
              <p className="text-gray-500 text-lg">No tasks yet. Add one above to get started!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
