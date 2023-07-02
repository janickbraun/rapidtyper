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
            arr[0].correct = null
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
        // <div style={{ display: "inline-flex" }} className="intent__container intent__sinle" key={i}>
        <>
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
        {/* </div> */}
        </>
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

        if (e.keyCode === 32 && e.target === document.body) e.preventDefault()

        if (e.key === splitted[currentIndex] && currentIndex < splitted.length) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
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
            if (currentIndex === 0) return
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
            setCurrentIndex(currentIndex - times)
            setCompleted(currentIndex - times)
            setTextArray(temp)
        } else if (e.key === "Backspace") {
            if (audioActive) playTypeSound()
            if (currentIndex === 0) return
            let temp = textArray
            if (currentIndex < splitted.length) temp[currentIndex].correct = undefined
            temp[currentIndex - 1].correct = null
            setCompleted(currentIndex - 1)

            setTextArray(temp)
            setCurrentIndex(currentIndex - 1)
        } else if (currentIndex < splitted.length && !e.ctrlKey) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
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

    const routeChange = () => {
        navigate("/")
    }

    return (
        <main className="usergame__comtop">
            <div className="rt__buttonset__inrace_actionsbtns">
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
                        <button className="absolutebottom" onClick={handleNewText}>
                            New text
                        </button>
                    </div>
                </div>
            )}
            {loggedin ? (
                <ProgressBar completed={(completed / splitted.length) * 100} name={username} online={true} done={false} connected={true} skin={skin} />
            ) : (
                <ProgressBar completed={(completed / splitted.length) * 100} name={"You"} online={false} done={false} connected={true} />
            )}
            <div className="helper_hidden texthelper" hidden>
                <input
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    style={{ width: 0, height: 0, outline: "none", WebkitAppearance: "none", border: 0, padding: 0, content: "" }}
                    ref={textInput}
                />
            </div>
            {openTouchDisclaimer && (
                <div>
                    In order to play you need to use a physical keyboard <button onClick={() => setOpenTouchDisclaimer(false)}>Close</button>
                </div>
            )}
            {isCapsLocked && <div className="uw_attentioncolorbtn">WARNING: CapsLock is active</div>}
        </main>
    )
}
