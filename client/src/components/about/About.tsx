import React, {useEffect} from "react"

export default function about() {

  useEffect(() => {
    document.title = 'Learn more about RapidTyper'
  }, [])

  return (
    <main>
      {
        // Anitmated components
      }
      <h1>About</h1>
    </main>
  )
}
