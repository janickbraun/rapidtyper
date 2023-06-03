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
    const [textArray, setTextArray] = useState<any>([])
    const [author, setAuthor] = useState("")
    const [username, setUsername] = useState("")

    const [participants, setParticipants] = useState<any>([])
    const [splitted, setSplitted] = useState<any>([])

    const [currentIndex, setCurrentIndex] = useState(0)
    const [startDateTime, setStartDateTime] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [time, setTime] = useState<number>(0)
    const [accuracy, setAccuracy] = useState<number>(0)
    const [wpm, setWpm] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)

    const token = localStorage.getItem("token")
    let navigate = useNavigate()
    const hasFired = useRef(false)

    const listItems = textArray.map((element: any, i: number) => (
        <div style={{ display: "inline-flex" }} key={i}>
            {element.character === " " ? (
                <>
                    {element.correct === undefined && <div style={{ display: "inline" }}>&nbsp;</div>}
                    {element.correct && <div style={{ display: "inline", background: "limegreen" }}>&nbsp;</div>}
                    {element.correct === false && <div style={{ display: "inline", background: "red" }}>&nbsp;</div>}
                </>
            ) : (
                <>
                    {element.correct === undefined && <div style={{ display: "inline" }}>{element.character}</div>}
                    {element.correct && <div style={{ display: "inline", background: "limegreen" }}>{element.character}</div>}
                    {element.correct === false && <div style={{ display: "inline", background: "red" }}>{element.character}</div>}
                </>
            )}
        </div>
    ))

    const mutationPlay: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/play", { token, code })
        },
        onSuccess: ({ data }) => {
            let temp = []
            for (let i = 0; i < data.participants.length; i += 1) {
                temp.push({ username: data.participants[i], completed: 0 })
            }
            setParticipants(temp)
            setText(data.text.text)
            setAuthor(data.text.author)
            setUsername(data.username)

            const splitt = data.text.text.split("")

            setSplitted(splitt)
            let arr: any = []
            for (let i = 0; i < splitt.length; i += 1) {
                arr.push({ character: splitt[i], correct: undefined })
            }
            setTextArray(arr)
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
        socket.emit("join", { code })
        //does the lobby exist
        //who are the participants
        //has the race begun?
        //delete lobby when begin
        //socket io for real time update
        //site leave listener
        //leaving not nessasay after timeout automatic kick
    }, [mutationPlay, code])

    useEffect(() => {
        socket.on("join", (data) => {
            //console.log(data.msg)
        })

        socket.on("leave", (data) => {
            //console.log(data.msg)
        })

        socket.on("typing", (data) => {
            // 1. Find the todo with the provided id
            const currentTodoIndex = participants.findIndex((item: any) => item.username === data.username)
            // 2. Mark the todo as complete
            const updatedTodo = Object.assign({}, participants[currentTodoIndex])
            updatedTodo.completed = data.completed + 1
            // 3. Update the todo list with the updated todo
            const newParticipants = participants.slice()
            newParticipants[currentTodoIndex] = updatedTodo
            setParticipants(newParticipants)
        })

        return () => {
            socket.off("join")
            socket.off("leave")
            socket.off("typing")
        }
    }, [participants])

    document.onkeydown = (e) => {
        const noFire = ["Shift", "CapsLock", "Tab"]

        if (noFire.includes(e.key)) return
        if (done) return

        if (e.key === splitted[currentIndex] && currentIndex < splitted.length) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            let temp: any = textArray
            temp[currentIndex].correct = true
            setTextArray(temp)
            setCurrentIndex(currentIndex + 1)

            let allCorrect = true
            for (let i = 0; i < currentIndex + 1; i += 1) {
                if (!textArray[i].correct) {
                    allCorrect = false
                    break
                }
            }
            if (allCorrect) {
                const temp = Math.round((completed / text.length) * 100)
                setCompleted(currentIndex)
                const now = Math.round((currentIndex / text.length) * 100)

                if (temp !== now) socket.emit("typing", { completed, code, username })

                //send other if roundend
            }
        } else if (e.key === "Backspace" && e.ctrlKey) {
            if (currentIndex === 0) return
            let temp: any = textArray
            let times = 1
            temp[currentIndex - 1].correct = undefined
            for (let i = currentIndex - 1; i > 0; i -= 1) {
                if (temp[i - 1].character === " ") break
                temp[i - 1].correct = undefined
                times += 1
            }
            setCurrentIndex(currentIndex - times)
            setTextArray(temp)
        } else if (e.key === "Backspace") {
            if (currentIndex === 0) return
            let temp = textArray
            temp[currentIndex - 1].correct = undefined
            setTextArray(temp)
            setCurrentIndex(currentIndex - 1)
        } else if (currentIndex < splitted.length && !e.ctrlKey) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            let temp = textArray
            temp[currentIndex].correct = false
            setMistakes(mistakes + 1)
            setTextArray(temp)
            setCurrentIndex(currentIndex + 1)
        }

        if (currentIndex === splitted.length - 1) {
            let allCorrect = true
            for (let i = 0; i < splitted.length; i += 1) {
                if (!textArray[i].correct) {
                    allCorrect = false
                    break
                }
            }
            if (allCorrect) {
                const seconds = Number(Math.abs((new Date().getTime() - startDateTime) / 1000).toFixed(2))
                const wpm = Number((splitted.length / 5 / (seconds / 60)).toFixed(2))
                const accuracy = Number((((splitted.length - mistakes) / splitted.length) * 100).toFixed(2))

                socket.emit("typing", { completed: splitted.length - 1, code, username })

                setTime(seconds)
                setDone(true)
                setCompleted(currentIndex + 1)
                setWpm(wpm)
                setAccuracy(accuracy)
            }
        }
    }

    return (
        <main>
            <h2>Multiplayer</h2>
            <ProgressBar bgcolor={"#6a1b9a"} completed={(completed / text.length) * 100} name={username} />
            {participants.map(
                (item: any, key: any) => item.username !== username && <ProgressBar key={key} bgcolor={"#6a1b9a"} completed={(item.completed / text.length) * 100} name={item.username} />
            )}

            <div style={{ position: "absolute", left: 10 }}>{listItems}</div>
            <br />
            <br />
            <br />
            <br />
            <div>~ {author}</div>

            {done && (
                <>
                    <div>Speed: {wpm} wpm</div>
                    <div>Accouracy: {accuracy}%</div>
                    <div>Time: {time} seconds</div>
                </>
            )}

            <br />
            <br />
            <br />
            <br />
            <br />
        </main>
    )
}
