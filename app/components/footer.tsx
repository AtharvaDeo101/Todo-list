export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Todo App. Stay organized, stay productive.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
