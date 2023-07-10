import React, { useEffect, useRef, useState } from "react"
import ProgressBar from "./ProgressBar"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import useEventListener from "@use-it/event-listener"
import useSound from "use-sound"
import useAuth from "../../hooks/useAuth"
import Stopwatch from "./Stopwatch"
import Confetti from "react-confetti"
import useWindowSize from "react-use/lib/useWindowSize"
import Overlay from "../modal/Overlay"

export default function Singleplayer() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [startDateTime, setStartDateTime] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [time, setTime] = useState<number>(0)
    const [currentWpm, setCurrentWpm] = useState<number>(0)
    const [accuracy, setAccuracy] = useState<number>(0)
    const [wpm, setWpm] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)
    const [startStopwatch, setStopwatch] = useState<boolean>(false)
    const [resetStopwatch, setResetStopwatch] = useState<boolean>(false)

    const [statsWpm, setStatsWpm] = useState(0)
    const [statsAccuracy, setStatsAccuracy] = useState(0)
    const [statsTimeSpent, setStatsTimeSpent] = useState(0)
    const [statsBest, setStatsBest] = useState(0)
    const [statsTotal, setStatsTotal] = useState(0)

    const [textArray, setTextArray] = useState<any>([])
    const [author, setAuthor] = useState("")
    const [splitted, setSplitted] = useState<any>([])
    const [isCapsLocked, setIsCapsLocked] = useState(false)
    const [openTouchDisclaimer, setOpenTouchDisclaimer] = useState(false)

    const textInput = useRef<any>(null)
    const { width, height } = useWindowSize()

    const [audioActive, setAudioActive] = useState(true)

    const [playTypeSound] = useSound("/mp3/type.mp3", { volume: 0.7 })
    const [playErrorSound] = useSound("/mp3/error.mp3", { volume: 0.7 })

    const [loggedin, username, skin] = useAuth()

    const token = localStorage.getItem("token")

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
            arr[0].correct = null
            setTextArray(arr)
        },
        onError: () => {
            navigate("/")
        },
    })

    const mutationFinish: any = useMutation({
        mutationFn: async ({ wpm, time, accuracy, date }: any) => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/singleplayer", { token, time, wpm, accuracy, date })
        },
        onSuccess: async () => {
            mutationStats.mutate()
        },
    })

    const mutationStats: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/singleplayer/stats", { token })
        },
        onSuccess: async ({ data }) => {
            if (data.status === "ok") {
                setStatsWpm(data.wpm)
                setStatsAccuracy(data.accuracy)
                setStatsTimeSpent(data.time)
                setStatsTotal(data.racesTotal)
                setStatsBest(data.bestRace)
            }
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
            mutationStats.mutate()

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
    }, [mutationPlay, navigate, mutationStats, loggedin])

    useEffect(() => {
        if (!done && startStopwatch && currentIndex > 0) {
            const seconds = Number(Math.abs((new Date().getTime() - startDateTime) / 1000).toFixed(2))
            const wpm = Math.floor(Number(currentIndex / 5 / (seconds / 60)))

            if (wpm < 1000) setCurrentWpm(wpm)
        }
    }, [done, startStopwatch, startDateTime, currentIndex])

    const listItems = textArray.map((element: any, i: number) => (
        <div style={{ display: "inline-flex" }} className="intent__container intent__single" key={i}>
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
                        <div className="_sgchar _sgchar__charR" style={{ display: "inline-block" }}>
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
        setResetStopwatch(true)
        setStopwatch(false)
        setCurrentWpm(0)
        let temp = textArray
        for (let i = 0; i < splitted.length; i += 1) {
            temp[i].correct = undefined
        }
        temp[0].correct = null
        setTextArray(temp)
        window.scrollTo(0, 0)

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

        if (e.keyCode === 32 && e.target === document.body) e.preventDefault()

        if (e.key === splitted[currentIndex] && currentIndex < splitted.length) {
            if (currentIndex === 0) {
                setStartDateTime(new Date().getTime())
                setResetStopwatch(false)
                setStopwatch(true)
            }
            if (audioActive) playTypeSound()
            let temp = textArray
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
            if (allCorrect) setCompleted(currentIndex)
        } else if (e.key === "Backspace" && e.ctrlKey) {
            if (audioActive) playTypeSound()
            if (currentIndex === 0) return handleRestart(e)
            let temp = textArray
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
            if (allCorrect) setCompleted(currentIndex - times)
            setCurrentIndex(currentIndex - times)
            if (currentIndex - times === 0) handleRestart(e)
        } else if (e.key === "Backspace") {
            if (audioActive) playTypeSound()
            if (currentIndex === 0 || currentIndex === 1) return handleRestart(e)
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
            if (allCorrect) setCompleted(currentIndex - 1)
            setCurrentIndex(currentIndex - 1)
        } else if (currentIndex < splitted.length && !e.ctrlKey) {
            if (currentIndex === 0) {
                setStartDateTime(new Date().getTime())
                setResetStopwatch(false)
                setStopwatch(true)
            }
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
                const seconds = Number(Math.abs((new Date().getTime() - startDateTime) / 1000).toFixed(2))
                const wpm = Number((splitted.length / 5 / (seconds / 60)).toFixed(2))
                const accuracy = Number((((splitted.length - mistakes) / splitted.length) * 100).toFixed(2))

                setStopwatch(false)
                setTime(seconds)
                setDone(true)
                setCompleted(currentIndex + 1)
                setWpm(wpm)
                setAccuracy(accuracy)

                if (loggedin) mutationFinish.mutate({ time: seconds, wpm, accuracy, date: new Date() })
            }
        }
    }

    useEventListener("keydown", handler)
    useEventListener("touchstart", touchDisclaimer)

    const routeChange = () => {
        navigate("/")
    }

    return (
        <main className="usergame__comtop">
            <div className="rt__buttonset__inrace_actionsbtns">
                {!done && (
                    <div className="dd_cflx">
                        <Stopwatch start={startStopwatch} reset={resetStopwatch} />
                        &nbsp;| {currentWpm}wpm
                    </div>
                )}
                <p className="hinttext">Playing in Singleplayer does not affect your stats</p>
                <button className="sortBtn cs_profilebtn muterswitch restart" onClick={handleRestart}>
                    <svg className="fwsvg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.8387 42.2989C18.7759 42.2989 14.4825 40.513 10.9584 36.9411C7.43434 33.3692 5.6779 29.0389 5.6891 23.95H9.09565C9.10485 28.0872 10.5302 31.6119 13.3718 34.5241C16.2134 37.4363 19.7022 38.8924 23.8381 38.8924C28.0315 38.8924 31.587 37.4197 34.5044 34.4744C37.4218 31.5291 38.8805 27.955 38.8805 23.7521C38.8805 19.6493 37.4076 16.1828 34.4619 13.3527C31.5161 10.5226 27.9749 9.1076 23.8381 9.1076C21.6352 9.1076 19.566 9.59837 17.6305 10.5799C15.695 11.5614 14.0058 12.8663 12.5631 14.4945H17.562V17.65H6.8728V7.0228H10.0044V12.1913C11.7616 10.1739 13.8359 8.58585 16.2272 7.42715C18.6185 6.26845 21.1555 5.6891 23.8381 5.6891C26.3779 5.6891 28.7658 6.16573 31.0017 7.119C33.2375 8.07227 35.1954 9.37123 36.8752 11.0159C38.555 12.6605 39.8769 14.5841 40.8409 16.7866C41.8049 18.989 42.287 21.3601 42.287 23.9C42.287 26.4399 41.8049 28.8277 40.8409 31.0634C39.8769 33.2992 38.555 35.2478 36.8752 36.9091C35.1954 38.5704 33.2375 39.8841 31.0017 40.85C28.7658 41.8159 26.3781 42.2989 23.8387 42.2989Z" />
                    </svg>
                </button>
                <button className="sortBtn cs_profilebtn muterswitch newtext" onClick={handleNewText}>
                    <svg className="fwsvg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.5 40V13H14V8H40V13H29.5V40H24.5ZM6.5 40V23H0V18H18V23H11.5V40H6.5Z" />
                        <path d="M39 48C36.81 48 34.8975 47.3175 33.2625 45.9525C31.6275 44.5875 30.6 42.87 30.18 40.8H32.97C33.36 42.12 34.1025 43.2 35.1975 44.04C36.2925 44.88 37.56 45.3 39 45.3C40.74 45.3 42.225 44.685 43.455 43.455C44.685 42.225 45.3 40.74 45.3 39C45.3 37.26 44.685 35.775 43.455 34.545C42.225 33.315 40.74 32.7 39 32.7C38.13 32.7 37.32 32.8575 36.57 33.1725C35.82 33.4875 35.16 33.93 34.59 34.5H37.2V37.2H30V30H32.7V32.565C33.51 31.785 34.455 31.1625 35.535 30.6975C36.615 30.2325 37.77 30 39 30C41.49 30 43.6125 30.8775 45.3675 32.6325C47.1225 34.3875 48 36.51 48 39C48 41.49 47.1225 43.6125 45.3675 45.3675C43.6125 47.1225 41.49 48 39 48Z" />
                    </svg>
                </button>
                <button className="sortBtn cs_profilebtn muterswitch" onClick={handleSoundControl} data-mutetool={audioActive ? "Mute" : "Unmute"}>
                    {audioActive ? (
                        <>
                            <svg className="fwsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M560-131v-62q97-28 158.5-107.5T780-481q0-101-61-181T560-769v-62q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm420 48v-337q55 17 87.5 64T660-480q0 57-33 104t-87 64Z" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <svg className="fwsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M813-56 681-188q-28 20-60.5 34.5T553-131v-62q23-7 44.5-15.5T638-231L473-397v237L273-360H113v-240h156L49-820l43-43 764 763-43 44Zm-36-232-43-43q20-34 29.5-72t9.5-78q0-103-60-184.5T553-769v-62q124 28 202 125.5T833-481q0 51-14 100t-42 93ZM643-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T643-422ZM473-592 369-696l104-104v208Z" />
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
            <div className={done ? "cfw_textcontainer wsi listing conf csi monospace__important bottomjoin" : "cfw_textcontainer wsi listing conf csi monospace__important"}>
                {listItems}
                <br />
                <span className="authorS">~ {author}</span>
            </div>

            {done && (
                <>
                    <Confetti width={width} height={height} run={wpm >= statsBest && done && Boolean(loggedin)} opacity={0.8} recycle={false} />
                    <div className="fullrescontainer">
                        <div className="cfw_textcontainer spctopjoin">
                            <div className="doublemr">
                                <div className="result__left" style={{ borderRight: "none" }}>
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
                            </div>
                            <div className="restartbuttonimp care2">
                                <button className="absolutebottom_v2 wws btn" onClick={handleRestart}>
                                    Try again
                                </button>
                                <button className="absolutebottom_v2" onClick={handleNewText}>
                                    New text
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {loggedin ? (
                <ProgressBar completed={(completed / splitted.length) * 100} name={username} online={true} done={false} connected={true} skin={skin} zindexkey={0} />
            ) : (
                <ProgressBar completed={(completed / splitted.length) * 100} name={"You"} online={false} done={false} connected={true} skin={"snail"} zindexkey={0} />
            )}
            <div className="helper_hidden texthelper">
                <input
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    style={{ width: 0, height: 0, outline: "none", WebkitAppearance: "none", border: 0, padding: 0, content: "" }}
                    ref={textInput}
                />
            </div>
            {openTouchDisclaimer && (
                <>
                    <Overlay />
                    <div className="share__modal selector_container">
                        <h1 className="modalCallerHeader kpbb">Attention</h1>
                        <div className="close_container">
                            <button className="close-modal-button" onClick={() => setOpenTouchDisclaimer(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                    <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                </svg>
                            </button>
                        </div>
                        <p className="clswd">
                            In order to play you need to use a physical keyboard!
                        </p>
                    </div>
                </>
            )}
            {isCapsLocked && <div className="uw_attentioncolorbtn">WARNING: CapsLock is active</div>}
            {loggedin && done && (
                <div className="statisitccontainer">
                    <div className="innerstats static_container">
                        <h3 className="statistics_header">
                            <svg className="sttsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><defs></defs><path className="fa-primary" d="M544 192h-32c-17.67 0-32 14.33-32 32v256c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V224C576 206.3 561.7 192 544 192zM224 192H192C174.3 192 160 206.3 160 224v256c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V224C256 206.3 241.7 192 224 192zM64 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-96C96 366.3 81.67 352 64 352zM384 320h-32c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-128C416 334.3 401.7 320 384 320z"></path><path className="fa-secondary" d="M576 48C576 74.5 554.5 96 528 96c-6.125 0-12-1.25-17.38-3.375l-95.38 76.25C415.6 171.3 416 173.6 416 176C416 202.5 394.5 224 368 224S320 202.5 320 176c0-2.375 .375-4.75 .75-7.125L225.4 92.63C220 94.75 214.1 96 208 96C203.8 96 199.6 95.25 195.8 94.25L94.25 195.8C95.25 199.6 96 203.8 96 208C96 234.5 74.5 256 48 256S0 234.5 0 208S21.5 160 48 160c4.25 0 8.375 .75 12.25 1.75l101.5-101.5C160.8 56.37 160 52.25 160 48C160 21.5 181.5 0 208 0S256 21.5 256 48c0 2.375-.375 4.75-.75 7.125l95.38 76.25C356 129.3 361.9 128 368 128s12 1.25 17.38 3.375l95.38-76.25C480.4 52.75 480 50.38 480 48C480 21.5 501.5 0 528 0S576 21.5 576 48z"></path></svg>
                            Statistics</h3>
                        <div>
                            <span className="stat_giver">Speed:</span> <span className="stat_reader">{statsWpm}wpm</span>
                        </div>
                        <div>
                            <span className="stat_giver">Accuracy:</span> <span className="stat_reader">{statsAccuracy}%</span>
                        </div>
                        <div>
                            <span className="stat_giver">Practices completed:</span> <span className="stat_reader">{statsTotal}</span>
                        </div>
                        <div>
                            <span className="stat_giver">Fastest practice:</span> <span className="stat_reader">{statsBest}wpm</span>
                        </div>
                        <div>
                            <span className="stat_giver">Time spent practicing:</span> <span className="stat_reader">{new Date(statsTimeSpent * 1000).toISOString().substring(11, 19)}</span>
                        </div>
                        <p className="slg_txt">Please note that statistics for singleplayer are not public and will not appear on the leaderboard.</p>
                    </div>
                </div>
            )}

            {!loggedin && (
                <div className="c_hid">
                    If you would like to see the detailed statistics, please <Link className="_userlink" to="/account/login">log in</Link>.
                </div>
            )}
        </main>
    )
}
