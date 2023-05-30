import React, { useEffect } from "react"

export default function About() {
    useEffect(() => {
        document.title = "Learn more about RapidTyper"
    }, [])

    return (
        <main>
            <h1>About</h1>
        </main>
    )
}
