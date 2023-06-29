import React, { useEffect, useRef, useState } from "react"
import ProgressBar from "./ProgressBar"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useEventListener from "@use-it/event-listener"
import useSound from "use-sound"
import { unlockSkin } from "../../helpers/skinHelper"
import useAuth from "../../hooks/useAuth"

export default function Singleplayer() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [startDateTime, setStartDateTime] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [time, setTime] = useState<number>(0)
    const [accuracy, setAccuracy] = useState<number>(0)
    const [wpm, setWpm] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)

    const [textArray, setTextArray] = useState<any>([])
    const [author, setAuthor] = useState("")
    const [splitted, setSplitted] = useState<any>([])
    const [isCapsLocked, setIsCapsLocked] = useState(false)
    const [openTouchDisclaimer, setOpenTouchDisclaimer] = useState(false)

    const textInput = useRef<any>(null)

    const [audioActive, setAudioActive] = useState(true)

    const [playTypeSound] = useSound("/mp3/type.mp3", { volume: 0.7 })
    const [playErrorSound] = useSound("/mp3/error.mp3", { volume: 0.7 })

    const [loggedin, username, skin] = useAuth()

    const hasFired = useRef(false)
    let navigate = useNavigate()

    const mutationPlay: any = useMutation({
        mutationFn: async () => {
            return await axios.get(process.env.REACT_APP_BACKEND_URL + "/api/gettext")
        },
        onSuccess: async ({ data }) => {
            setAuthor(data.author)

            const splitt = data.text.split("")

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

    const handleSoundControl = () => {
        localStorage.setItem("audio", String(!audioActive))
        setAudioActive(!audioActive)
    }

    useEffect(() => {
        document.title = "Singleplayer | RapidTyper"
        if (!hasFired.current) {
            hasFired.current = true
            mutationPlay.mutate()
            const store = JSON.parse(window.localStorage.getItem("cookies") as string)
            if (!store || store.allow !== true || (Number(new Date()) - store.date) / (1000 * 3600 * 24 * 365) > 1) {
                navigate("/")
            }
            const tempAudio = localStorage.getItem("audio")
            if (!tempAudio) {
                localStorage.setItem("audio", "true")
                setAudioActive(true)
            } else if (tempAudio === "true") {
                setAudioActive(true)
            } else if (tempAudio === "false") {
                setAudioActive(false)
            }
            unlockSkin("fly")
        }
    }, [mutationPlay, navigate])

    const listItems = textArray.map((element: any, i: number) => (
        <div style={{ display: "inline-flex" }} className="intent__container intent__sinle" key={i}>
            {element.character === " " ? (
                <>
                    {element.correct === undefined && (
                        <div style={{ display: "inline" }} className="_sgchar _sgchar__space">
                            &nbsp;
                        </div>
                    )}
                    {element.correct && (
                        <div style={{ display: "inline", background: "limegreen" }} className="_sgchar _sgchar__space">
                            &nbsp;
                        </div>
                    )}
                    {element.correct === false && (
                        <div style={{ display: "inline", background: "red" }} className="_sgchar _sgchar__space">
                            &nbsp;
                        </div>
                    )}
                </>
            ) : (
                <>
                    {element.correct === undefined && (
                        <div style={{ display: "inline" }} className="_sgchar _sgchar__charR">
                            {element.character}
                        </div>
                    )}
                    {element.correct && (
                        <div style={{ display: "inline", background: "limegreen" }} className="_sgchar _sgchar__charR">
                            {element.character}
                        </div>
                    )}
                    {element.correct === false && (
                        <div style={{ display: "inline", background: "red" }} className="_sgchar _sgchar__charR">
                            {element.character}
                        </div>
                    )}
                </>
            )}
        </div>
    ))

    const touchDisclaimer = (e: any) => {
        const store = JSON.parse(window.localStorage.getItem("cookies") as string)
        if (!store || store.allow !== true || (Number(new Date()) - store.date) / (1000 * 3600 * 24 * 365) > 1) {
            navigate("/")
        }

        const tempTouch = localStorage.getItem("touch")
        if (!tempTouch) {
            setOpenTouchDisclaimer(true)
            localStorage.setItem("touch", "true")
        }
    }

    const handleRestart = (e: any) => {
        setDone(false)
        setCurrentIndex(0)
        setAccuracy(0)
        setMistakes(0)
        setCompleted(0)
        setTime(0)
        setWpm(0)
        let temp = textArray
        for (let i = 0; i < splitted.length; i += 1) {
            temp[i].correct = undefined
        }
        setTextArray(temp)

        e.currentTarget.blur()
    }

    const handleNewText = (e: any) => {
        e.currentTarget.blur()
        handleRestart(e)
        mutationPlay.mutate()
    }

    useEffect(() => {
        textInput.current.focus()
    }, [])

    const handler = (e: any) => {
        textInput.current.focus()
        const noFire = ["Shift", "CapsLock", "Tab", "Enter"]

        if (e.key === "Enter" && e.shiftKey) return handleNewText(e)

        if (e.key === "Enter") return handleRestart(e)

        if (isCapsLocked !== e.getModifierState("CapsLock")) setIsCapsLocked(e.getModifierState("CapsLock"))

        if (noFire.includes(e.key)) return
        if (done) return

        if (e.key === splitted[currentIndex] && currentIndex < splitted.length) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            if (audioActive) playTypeSound()
            let temp = textArray
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
            if (allCorrect) setCompleted(currentIndex)
        } else if (e.key === "Backspace" && e.ctrlKey) {
            if (audioActive) playTypeSound()
            if (currentIndex === 0) return
            let temp = textArray
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
            if (audioActive) playTypeSound()
            if (currentIndex === 0) return
            let temp = textArray
            temp[currentIndex - 1].correct = undefined
            setTextArray(temp)
            setCurrentIndex(currentIndex - 1)
        } else if (currentIndex < splitted.length && !e.ctrlKey) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            if (audioActive) playErrorSound()
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

                setTime(seconds)
                setDone(true)
                setCompleted(currentIndex + 1)
                setWpm(wpm)
                setAccuracy(accuracy)
            }
        }
    }

    useEventListener("keydown", handler)
    useEventListener("touchstart", touchDisclaimer)

    return (
        <main className="usergame__comtop">
            {loggedin ? (
                <ProgressBar completed={(completed / splitted.length) * 100} name={username} online={true} done={false} connected={true} skin={skin} />
            ) : (
                <ProgressBar completed={(completed / splitted.length) * 100} name={"You"} online={false} done={false} connected={true} />
            )}
            <input
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                style={{ width: 0, height: 0, outline: "none", WebkitAppearance: "none", border: 0, padding: 0, content: "" }}
                ref={textInput}
            />
            <div style={{ position: "absolute", left: 10 }} className="cfw_textcontainer wsi listing conf csi monospace__important">
                {listItems}
            </div>
            <br />
            <br />
            <div style={{ marginTop: "6rem" }}>~ {author}</div>
            {openTouchDisclaimer && (
                <div>
                    In order to play you need to use a physical keyboard <button onClick={() => setOpenTouchDisclaimer(false)}>Close</button>
                </div>
            )}
            {isCapsLocked && <div>WARNING: CapsLock is active</div>}
            <br />
            <br />
            {done && (
                <>
                    <div>Speed: {wpm} wpm</div>
                    <div>Accouracy: {accuracy}%</div>
                    <div>Time: {time} seconds</div>
                </>
            )}
            <button onClick={handleRestart}>Restart</button> <button onClick={handleNewText}>New text</button>
            <br />
            <br />
            <button onClick={handleSoundControl}>{audioActive ? <>Mute</> : <>Unmute</>}</button>
            <div>Playing in Singleplayer does not effect your stats</div>
        </main>
    )
}
