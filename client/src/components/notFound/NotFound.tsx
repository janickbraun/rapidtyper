import React, { useEffect } from "react"

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Page Not Found | RapidTyper'
  }, [])
  return (
    <main>
      <h1>Not Found</h1>
    </main>
  )
}
