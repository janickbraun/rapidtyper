import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import io, { Socket } from "socket.io-client"
import ProgressBar from "./ProgressBar"

const socket: Socket = io(process.env.REACT_APP_BACKEND_URL as string)

export default function Multiplayer() {
    const { code } = useParams()
    const [text, setText] = useState("")
    const [author, setAuthor] = useState("")
    const [completed, setCompleted] = useState(0)
    const [participants, setParticipants] = useState([])

    const token = localStorage.getItem("token")
    let navigate = useNavigate()
    const hasFired = useRef(false)

    const mutationPlay: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/play", { token, code })
        },
        onSuccess: ({ data }) => {
            setParticipants(data.participants)
            setText(data.text.text)
            setAuthor(data.text.author)
            console.log(data)
        },
        onError: () => {
            navigate("/")
        },
    })

    useEffect(() => {
        if (mutationPlay.isIdle && !hasFired.current) {
            hasFired.current = true
            mutationPlay.mutate()
        }
        //console.log(code)
        //socket.emit("join", { code })

        //does the lobby exist
        //who are the participants
        //has the race begun?
        //delete lobby when begin
        //socket io for real time update
        //site leave listener
        //leaving not nessasay after timeout automatic kick
    }, [mutationPlay])

    useEffect(() => {
        socket.on("join", (data) => {
            //console.log(data.msg)
        })

        socket.on("leave", (data) => {
            //console.log(data.msg)
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
            <ProgressBar bgcolor={"#6a1b9a"} completed={(completed / text.length) * 100} name={"You"} />
            {participants.map((item, key) => (
                <ProgressBar key={key} bgcolor={"#6a1b9a"} completed={(completed / text.length) * 100} name={item} />
            ))}

            <div>{text}</div>
            <div>~ {author}</div>

            <br />
            <br />
            <br />
            <br />
            <br />
            <button onClick={handleClipboard}>Copy to clipboard</button>
        </main>
    )
}
