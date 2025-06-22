export const metadata = {
  title: 'Todo List App',
  description: 'A simple Todo List application with cuisine selector, built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}