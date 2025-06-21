import TodoHero from "./components/todo-hero"
import Footer from "./components/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <TodoHero />
      <Footer />
    </main>
  )
}
