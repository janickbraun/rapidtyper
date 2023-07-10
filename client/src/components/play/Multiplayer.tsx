import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import io, { Socket } from "socket.io-client"
import ProgressBar from "./ProgressBar"
import Timer from "./Timer"
import useEventListener from "@use-it/event-listener"
import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"
import useSound from "use-sound"
import UserRaceContentOverlay from "../modal/UserRaceContentOverlay"
import Overlay from "../modal/Overlay"
import Stopwatch from "./Stopwatch"
import useAuth from "../../hooks/useAuth"

const socket: Socket = io(process.env.REACT_APP_BACKEND_URL as string)

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

function addZeroes(num: number) {
    return num.toLocaleString("en", { useGrouping: false, minimumFractionDigits: 2 })
}

export default function Multiplayer() {
    const { code } = useParams()
    const [text, setText] = useState("")
    const [textArray, setTextArray] = useState<any>([])
    const [author, setAuthor] = useState("")
    const [username, setUsername] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedin, checkUsername] = useAuth()

    const [participants, setParticipants] = useState<any>([])
    const [splitted, setSplitted] = useState<any>([])

    const [currentIndex, setCurrentIndex] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [time, setTime] = useState<number>(0)
    const [accuracy, setAccuracy] = useState<number>(0)
    const [wpm, setWpm] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [waitingTitle, setWaitingTitle] = useState("")
    const [winners, setWinners] = useState<any>([])
    const [isCapsLocked, setIsCapsLocked] = useState(false)
    const [openTouchDisclaimer, setOpenTouchDisclaimer] = useState(false)

    const [startStopwatch, setStopwatch] = useState<boolean>(false)
    const [resetStopwatch, setResetStopwatch] = useState<boolean>(false)

    const textInput = useRef<any>(null)
    const { width, height } = useWindowSize()

    const token = localStorage.getItem("token")
    let navigate = useNavigate()
    const hasFired = useRef(0)

    const [audioActive, setAudioActive] = useState(true)

    const [playTypeSound] = useSound("/mp3/type.mp3", { volume: 0.7 })
    const [playErrorSound] = useSound("/mp3/error.mp3", { volume: 0.7 })

    const listItems = textArray.map((element: any, i: number) => (
        <div style={{ display: "inline-flex" }} className="intent__container intent__sinle" key={i}>
            {element.character === " " ? (
                <>
                    {element.correct === undefined && (
                        <div className="_sgchar _sgchar__space" style={{ display: "inline" }}>
                            &nbsp;
                        </div>
                    )}
                    {element.correct && (
                        <div className="_sgchar _sgchar__space" style={{ display: "inline", backgroundColor: "#5bba6f26", verticalAlign: "text-bottom" }}>
                            &nbsp;
                        </div>
                    )}
                    {element.correct === false && (
                        <div className="_sgchar _sgchar__space" style={{ display: "inline", backgroundColor: "#ff333326", verticalAlign: "text-bottom" }}>
                            &nbsp;
                        </div>
                    )}
                    {element.correct === null && (
                        <div className="_sgchar _sgchar__space underline__advanced" style={{ display: "inline", backgroundColor: "#3a3c436a", verticalAlign: "text-bottom" }}>
                            &nbsp;
                        </div>
                    )}
                </>
            ) : (
                <>
                    {element.correct === undefined && (
                        <div className="_sgchar _sgchar__charR" style={{ display: "inline" }}>
                            {element.character}
                        </div>
                    )}
                    {element.correct && (
                        <div className="_sgchar _sgchar__charR" style={{ display: "inline", color: "#5bba6f", backgroundColor: "#5bba6f26" }}>
                            {element.character}
                        </div>
                    )}
                    {element.correct === false && (
                        <div className="_sgchar _sgchar__charR" style={{ display: "inline", color: "#ff3333", backgroundColor: "#ff333326" }}>
                            {element.character}
                        </div>
                    )}
                    {element.correct === null && (
                        <div className="_sgchar _sgchar__space underline__advanced" style={{ display: "inline", backgroundColor: "#3a3c436a", verticalAlign: "text-bottom" }}>
                            {element.character}
                        </div>
                    )}
                </>
            )}
        </div>
    ))

    const handleSoundControl = () => {
        localStorage.setItem("audio", String(!audioActive))
        setAudioActive(!audioActive)
    }

    const mutationMultiplayer: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/multiplayer", { token })
        },
        onSuccess: ({ data }) => {
            window.location.replace("/multiplayer/" + data.code)
        },
        onError: ({ data }) => {
            console.log(data)
        },
    })

    const mutationPlay: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/play", { token, code })
        },
        onSuccess: async ({ data }) => {
            let temp = []
            for (let i = 0; i < data.participants.length; i += 1) {
                temp.push({ username: data.participants[i].username, completed: 0, skin: data.participants[i].skin, connected: true })
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
            arr[0].correct = null
            setTextArray(arr)
        },
        onError: ({ data }) => {
            if (data.reason === "full" && data.username === checkUsername) window.location.href = "/"
            console.log(data)
        },
    })

    useEffect(() => {
        document.title = "Multiplayer | RapidTyper"
        textInput.current.focus()
        window.history.pushState({ prevUrl: window.location.href }, "", "/multiplayer/" + code)
    }, [code])
    useEffect(() => {
        if (mutationPlay.isIdle && hasFired.current === 0) {
            hasFired.current = 1
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
        }

        if (mutationPlay.isSuccess && hasFired.current === 1) {
            hasFired.current = 2
            socket.emit("join", { code, username })
        }
    }, [mutationPlay, code, username, navigate])

    useEffect(() => {
        socket.on("typing", (data) => {
            const currentIndex = participants.findIndex((item: any) => item.username === data.username)
            const updated = Object.assign({}, participants[currentIndex])
            updated.completed = data.completed + 1
            const newParticipants = participants.slice()
            newParticipants[currentIndex] = updated
            setParticipants(newParticipants)
        })

        return () => {
            socket.off("typing")
        }
    }, [participants])

    useEffect(() => {
        socket.on("join", () => {
            mutationPlay.mutate()
        })

        socket.on("leave", (data) => {
            if (hasStarted) {
                const temp = participants.map((obj: any) => {
                    if (obj.username === data.username) {
                        return { ...obj, connected: false }
                    }
                    return obj
                })

                setParticipants(temp)
            } else {
                const temp = participants.filter((el: any) => {
                    return el.username !== data.username
                })

                setParticipants(temp)
            }
        })

        socket.on("waiting", async () => {
            setWaitingTitle("Waiting for opponents. Starting in ca: ")
            await delay(20000)
            socket.emit("starting", { code })
        })

        socket.on("starting", async () => {
            setTimeout(async () => {
                setWaitingTitle("Starting in")
                await delay(10000)
                socket.emit("start", { code })
            }, 250)
        })

        socket.on("start", () => {
            setHasStarted(true)
            setResetStopwatch(false)
            setStopwatch(true)
        })

        socket.on("finish", (data) => {
            if (data.username === username) {
                setTime(data.time)
                setWpm(data.wpm)
            }

            setWinners([...winners, { username: data.username, wpm: data.wpm }])
        })

        return () => {
            socket.off("join")
            socket.off("finish")
            socket.off("waiting")
            socket.off("leave")
        }
    }, [mutationPlay, code, winners, participants, hasStarted, username])

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

    const handler = (e: any) => {
        textInput.current.focus()
        const noFire = ["Shift", "CapsLock", "Tab", "Enter"]

        if (isCapsLocked !== e.getModifierState("CapsLock")) setIsCapsLocked(e.getModifierState("CapsLock"))

        if (e.key === "Enter" && done) return mutationMultiplayer.mutate()

        if (!hasStarted) return
        if (noFire.includes(e.key)) return
        if (done) return

        if (e.keyCode === 32 && e.target === document.body) e.preventDefault()

        if (e.key === splitted[currentIndex] && currentIndex < splitted.length) {
            if (audioActive) playTypeSound()
            let temp: any = textArray
            temp[currentIndex].correct = true
            if (currentIndex < splitted.length - 1) temp[currentIndex + 1].correct = null
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
            }
        } else if (e.key === "Backspace" && e.ctrlKey) {
            if (audioActive) playTypeSound()
            if (currentIndex === 0) return
            let temp: any = textArray
            let times = 1
            temp[currentIndex - 1].correct = undefined
            if (currentIndex < splitted.length) temp[currentIndex].correct = undefined
            for (let i = currentIndex - 1; i > 0; i -= 1) {
                if (temp[i - 1].character === " ") break
                temp[i - 1].correct = undefined
                times += 1
            }
            temp[currentIndex - times].correct = null

            setTextArray(temp)
            let allCorrect = true
            for (let i = 0; i < currentIndex - times; i += 1) {
                if (!textArray[i].correct) {
                    allCorrect = false
                    break
                }
            }
            if (allCorrect) {
                const temp = Math.round((completed / text.length) * 100)
                setCompleted(currentIndex - times)
                const now = Math.round((currentIndex - times / text.length) * 100)

                if (temp !== now) socket.emit("typing", { completed, code, username })
            }
            setCurrentIndex(currentIndex - times)
        } else if (e.key === "Backspace") {
            if (audioActive) playTypeSound()
            if (currentIndex === 0) return
            let temp = textArray
            if (currentIndex < splitted.length) temp[currentIndex].correct = undefined
            temp[currentIndex - 1].correct = null
            setTextArray(temp)
            let allCorrect = true
            for (let i = 0; i < currentIndex - 1; i += 1) {
                if (!textArray[i].correct) {
                    allCorrect = false
                    break
                }
            }
            if (allCorrect) {
                const temp = Math.round((completed / text.length) * 100)
                setCompleted(currentIndex - 1)
                const now = Math.round((currentIndex - 1 / text.length) * 100)

                if (temp !== now) socket.emit("typing", { completed, code, username })
            }
            setCurrentIndex(currentIndex - 1)
        } else if (currentIndex < splitted.length && !e.ctrlKey) {
            if (audioActive) playErrorSound()
            let temp = textArray
            temp[currentIndex].correct = false
            if (currentIndex < splitted.length - 1) temp[currentIndex + 1].correct = null
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
                const accuracy = Number((((splitted.length - mistakes) / splitted.length) * 100).toFixed(2))

                socket.emit("finish", { username, code, accuracy, token, date: new Date() })
                console.log("finish emit ")
                socket.emit("typing", { completed: splitted.length - 1, code, username })

                setStopwatch(false)
                setDone(true)
                setCompleted(currentIndex + 1)
                setAccuracy(accuracy)
            }
        }
    }

    useEventListener("keydown", handler)
    useEventListener("touchstart", touchDisclaimer)

    const handlePop = (e: any) => {
        const store = JSON.parse(window.localStorage.getItem("cookies") as string)
        if (store && store.allow === true && (Number(new Date()) - store.date) / (1000 * 3600 * 24 * 365) < 1) {
            localStorage.setItem("back", "true")
        }
    }

    useEffect(() => {
        window.addEventListener("popstate", handlePop)
        return () => {
            window.removeEventListener("popstate", handlePop)
        }
    }, [])

    const routeChange = () => {
        window.location.href = "/"
    }

    return (
        <main className="usergame__comtop">
            <div className="rt__buttonset__inrace_actionsbtns">
                {!done && (
                    <div className="dd_cflx">
                        <Stopwatch start={startStopwatch} reset={resetStopwatch} />
                    </div>
                )}
                <button className="sortBtn cs_profilebtn muterswitch" onClick={handleSoundControl} data-mutetool={audioActive ? "Mute" : "Unmute"}>
                    {audioActive ? (
                        <>
                            <svg className="fwsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M813-56 681-188q-28 20-60.5 34.5T553-131v-62q23-7 44.5-15.5T638-231L473-397v237L273-360H113v-240h156L49-820l43-43 764 763-43 44Zm-36-232-43-43q20-34 29.5-72t9.5-78q0-103-60-184.5T553-769v-62q124 28 202 125.5T833-481q0 51-14 100t-42 93ZM643-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T643-422ZM473-592 369-696l104-104v208Z" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <svg className="fwsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M560-131v-62q97-28 158.5-107.5T780-481q0-101-61-181T560-769v-62q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm420 48v-337q55 17 87.5 64T660-480q0 57-33 104t-87 64Z" />
                            </svg>
                        </>
                    )}
                </button>
                <button className="sortBtn cs_profilebtn muterswitch newleft" onClick={routeChange} data-mutetool={"Leave game"}>
                    <svg className="fwsvg redcolorsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M180-120q-24 0-42-18t-18-42v-210h60v210h600v-602H180v212h-60v-212q0-24 18-42t42-18h600q24 0 42 18t18 42v602q0 24-18 42t-42 18H180Zm233-167-45-45 118-118H120v-60h366L368-628l45-45 193 193-193 193Z" />
                    </svg>
                </button>
            </div>
            <div className="helper_hidden texthelper">
                <input
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    style={{ width: 0, height: 0, outline: "none", WebkitAppearance: "none", border: 0, padding: 0, content: "" }}
                    ref={textInput}
                />
            </div>
            <div className={done ? "cfw_textcontainer wsi listing conf csi monospace__important bottomjoin" : "cfw_textcontainer wsi listing conf csi monospace__important"}>
                {listItems} <br />
                <span className="authorS">~ {author}</span>
            </div>
            {done && (
                <div className="fullrescontainer">
                    <div className="cfw_textcontainer spctopjoin">
                        <div className="doublemr">
                            <div className="result__left">
                                <h1 className="resultheading">Results</h1>
                                <div>
                                    <span className="stat_giver">Speed:</span> <span className="stat_reader_race">{wpm}wpm</span>
                                </div>
                                <div>
                                    <span className="stat_giver">Accuracy:</span> <span className="stat_reader_race">{accuracy}%</span>
                                </div>
                                <div>
                                    <span className="stat_giver">Time:</span> <span className="stat_reader_race">{time}s</span>
                                </div>
                            </div>
                            <div className="leaderboard__right">
                                <h1 className="resultheading">Leaderboard</h1>
                                {winners.map((item: any, key: any) => (
                                    <div className={key === 0 ? "firstplace" : key === 1 ? "secondplace" : key === 2 ? "thirdplace" : ""} key={key}>
                                        {key + 1 + ". "}{" "}
                                        <span className="username">
                                            <Link style={{ color: "inherit" }} to={"/user/" + item.username}>
                                                {item.username}
                                            </Link>
                                        </span>{" "}
                                        {" | " + addZeroes(item.wpm) + "wpm"}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="absolutebottom" onClick={() => mutationMultiplayer.mutate()}>
                            Race again
                        </button>
                    </div>
                </div>
            )}
            <ProgressBar
                bgcolor={"#6a1b9a"}
                completed={(completed / text.length) * 100}
                name={username}
                skin={
                    participants.filter((e: any) => {
                        return e.username === username
                    })[0]?.skin
                }
                online={true}
                done={done}
                connected={true}
                zindexkey={0}
            />
            {participants.map(
                (item: any, key: any) =>
                    item.username !== username && (
                        <ProgressBar
                            key={key}
                            zindexkey={key}
                            bgcolor={"#6a1b9a"}
                            completed={(item.completed / text.length) * 100}
                            name={item.username}
                            skin={item.skin}
                            online={true}
                            done={done}
                            connected={item.connected}
                        />
                    )
            )}

            {openTouchDisclaimer && (
                <>
                    <Overlay />
                    <div className="share__modal selector_container">
                        <h1 className="modalCallerHeader kpbb">Notice</h1>
                        <div className="close_container">
                            <button className="close-modal-button" onClick={() => setOpenTouchDisclaimer(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                    <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                </svg>
                            </button>
                        </div>
                        <p style={{ margin: "1.2rem 2rem" }}>In order to play you need to use a physical keyboard!</p>
                    </div>
                </>
            )}
            {isCapsLocked && <div className="uw_attentioncolorbtn">WARNING: CapsLock is active</div>}
            <Confetti width={width} height={height} run={winners[0]?.username === username} opacity={0.8} recycle={false} />
            {waitingTitle === "" && !hasStarted && <UserRaceContentOverlay />}
            {waitingTitle !== "" && !hasStarted && <UserRaceContentOverlay />}
            {waitingTitle === "" && !hasStarted && (
                <>
                    <div className="__completemodal">
                        <p className="WFOP">Waiting for opponents...</p>
                    </div>
                </>
            )}
            {waitingTitle !== "" && !hasStarted && (
                <div className="__completemodal">
                    <div className="WFOP">
                        <Timer initialSeconds={30} title={waitingTitle} />
                    </div>
                </div>
            )}

            {/* !!!! */}

            <br />
        </main>
    )
}
