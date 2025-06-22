import './globals.css'

export const metadata = {
  title: 'Todo List App',
  description: 'A simple Todo List application built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}