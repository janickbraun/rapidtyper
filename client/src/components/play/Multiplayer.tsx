import React, { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function Multiplayer() {
    const { code } = useParams()

    useEffect(() => {
        //does the lobby exist
        //who are the participants
        //has the race begun?
        //delete lobby when begin
        //socket io for real time update
        //site leave listener
    }, [])

    const handleClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    return (
        <main>
            <h2>Multiplayer</h2>
            <button onClick={handleClipboard}>Copy to clipboard</button>
        </main>
    )
}
