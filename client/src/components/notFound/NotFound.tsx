import React, { useEffect } from "react"

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Page Not Found | RapidTyper'
  }, [])
  return (
    <main style={{textAlign: "center", paddingTop: "1em"}}>
      <h2>404 Not Found</h2>
    </main>
  )
}
