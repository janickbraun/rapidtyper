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

    return (
        <main>
            <h2>Multiplayer</h2>
        </main>
    )
}
