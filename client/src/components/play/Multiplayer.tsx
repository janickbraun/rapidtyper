import React, { useEffect } from "react"
import { useParams, useBeforeUnload, useLocation } from "react-router-dom"
import io, { Socket } from "socket.io-client"

const socket: Socket = io(process.env.REACT_APP_BACKEND_URL as string)

export default function Multiplayer() {
    const { code } = useParams()
    let location = useLocation()

    useEffect(() => {
        console.log(code)
        socket.emit("join", { code })
        //does the lobby exist
        //who are the participants
        //has the race begun?
        //delete lobby when begin
        //socket io for real time update
        //site leave listener
        //leaving not nessasay after timeout automatic kick
    }, [code])

    useEffect(() => {
        socket.on("join", (data) => {
            console.log(data.msg)
        })

        socket.on("leave", (data) => {
            console.log(data.msg)
        })

        return () => {
            socket.off("join")
            socket.off("leave")
        }
    }, [])

    const handleClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    const handleStartRace = () => {
        //stop joining
        //count down
        //start
    }

    return (
        <main>
            <h2>Multiplayer</h2>
            <button onClick={handleClipboard}>Copy to clipboard</button>
        </main>
    )
}
