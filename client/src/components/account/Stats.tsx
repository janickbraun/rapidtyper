import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import useAuth from "../../hooks/useAuth"
import Overlay from "../modal/Overlay"

export default function Stats(props: any) {
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [racesTotal, setRacesTotal] = useState(0)
    const [racesWon, setRacesWon] = useState(0)
    const [bestRace, setBestRace] = useState(0)
    const [timeSpentRacing, setTimeSpentRacing] = useState(0)
    const [date, setDate] = useState("")
    const [country, setCountry] = useState("")
    const [skin, setSkin] = useState("snail")
    const [skinsOpen, setSkinsOpen] = useState(false)
    const [skins, setSkins] = useState<Array<any>>([])
    const [shareOpen, setShareOpen] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedin, username, skin2, verified] = useAuth()

    const token = localStorage.getItem("token")

    const hasFired = useRef(false)

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/getstats", { username: props.username })
        },
        onSuccess: ({ data }) => {
            setWpm(data.wpm)
            setAccuracy(data.accuracy)
            setRacesTotal(data.racesTotal)
            setRacesWon(data.racesWon)
            setBestRace(data.bestRace)
            setDate(data.date)
            setSkin(data.skin)
            setSkins(data.skins)
            setCountry(data.country)
            setTimeSpentRacing(data.time)
        },
    })

    const mutationAnother: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/verifyanother", { token })
        },
        onSuccess: ({ data }) => {
            console.log(data)
        },
    })

    const mutationSkin: any = useMutation({
        mutationFn: async (s: string) => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/changeskin", { skin: s, token })
        },
        onSuccess: ({ data }) => {
            setSkin(data.skin)
            setSkinsOpen(false)
        },
    })

    useEffect(() => {
        if (mutation.isIdle && !hasFired.current) {
            hasFired.current = true
            mutation.mutate()
        }
    }, [mutation])

    const handleSkinChange = (s: string) => {
        mutationSkin.mutate(s)
    }

    const handleShare = (msg: string) => {
        if (msg === "Successfully copied to clipboard") {
            navigator.clipboard.writeText("https://rapidtyper.com/user/" + props.username)
        }

        setShareOpen(false)
    }

    const tweetText = `Check out the stats from ${props.username} on https://rapidtyper.com
        Speed: ${wpm}wpm
        Accuracy: ${accuracy}%
        Races completed: ${racesTotal}
        Races won: ${racesWon}
        Fastest race: ${bestRace}wpm
        Time spent racing: ${new Date(timeSpentRacing * 1000).toISOString().substring(11, 19)}`

    return (
        <div>
            {mutation.isError && <div>Profile was not found</div>}
            {mutation.isSuccess && (
                <div className="centerContainer__stat">
                    {skinsOpen ? <Overlay /> : ""}
                    {skinsOpen && (
                        <div className="selector_container">
                            <h1 className="modalCallerHeader">Your Skins</h1>
                            <div className="close_container">
                                <button className="close-modal-button" onClick={() => setSkinsOpen(!skinsOpen)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                        <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="skin_div">
                                {skins.map((val, key) => {
                                    return (
                                        <div key={key}>
                                            <img
                                                onClick={() => handleSkinChange(val)}
                                                src={"/img/skins/" + val + ".png" || ".gif"}
                                                alt="skin"
                                                tabIndex={0}
                                                draggable="false"
                                                className="user_default_skinimg skin_changeIMG"
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="wshinttext">How to unlock skins:</div>
                            <ul className="cscontent">
                                <li>Type faster</li>
                                <li>Complete and win more races</li>
                                <li>Improve your accuracy</li>
                                <li>Look for easter eggs 👀</li>
                                <li>Buy</li>
                            </ul>
                        </div>
                    )}
                    <div className="user_pfd_container">
                        {/* */}
                        <div>
                            <div className="cf__imgc__flxc">
                                <figure className="user__skincontainer">
                                    <img src={"/img/skins/" + skin + ".png"} alt="skin" className="user_default_skinimg" />
                                </figure>
                                {loggedin && username === props.username && (
                                    <button className={skinsOpen ? "sortBtn cs_profilebtn cpp_cl" : "sortBtn cs_profilebtn cpp_fg"} onClick={() => setSkinsOpen(!skinsOpen)}>
                                        {skinsOpen ? (
                                            <>
                                                <svg className="csbi" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="csbi" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path d="M488 232c-13.25 0-24 10.75-24 24c0 57.34-46.66 104-104 104H145.9l63.03-63.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0l-104 104c-9.375 9.375-9.375 24.56 0 33.94l104 104C179.7 509.7 185.8 512 192 512s12.28-2.344 16.97-7.031c9.375-9.375 9.375-24.56 0-33.94L145.9 408H360c83.81 0 152-68.19 152-152C512 242.7 501.3 232 488 232zM152 152h214.1l-63.03 63.03c-9.375 9.375-9.375 24.56 0 33.94C307.7 253.7 313.8 256 320 256s12.28-2.344 16.97-7.031l104-104c9.375-9.375 9.375-24.56 0-33.94l-104-104c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L366.1 104H152C68.19 104 0 172.2 0 255.1C0 269.2 10.75 280 24 280S48 269.3 48 256C48 198.7 94.66 152 152 152z" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="_usc">
                            <h1>
                                {props.username} &nbsp;
                                <img className="user_origincounty uoc_wbd" src={"https://flagicons.lipis.dev/flags/1x1/" + country + ".svg"} loading="lazy" draggable="false" alt="" />
                            </h1>
                            <div>Racing since: {date}</div>
                        </div>
                        {loggedin && username === props.username && !verified && (
                            <div style={{ textAlign: "right" }}>
                                <p>
                                    <span>Your email address has not been verified. Please check your email.</span>
                                    <span>&nbsp;</span>{" "}
                                    <button className="inlinebutton" onClick={() => mutationAnother.mutate()}>
                                        Resend email
                                    </button>
                                </p>
                            </div>
                        )}
                        <button onClick={() => setShareOpen(true)}>Share Profile</button>
                    </div>
                    <div className="c_stats">
                        <h3>
                            <svg className="sttsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <defs></defs>
                                <path
                                    className="fa-primary"
                                    d="M544 192h-32c-17.67 0-32 14.33-32 32v256c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V224C576 206.3 561.7 192 544 192zM224 192H192C174.3 192 160 206.3 160 224v256c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V224C256 206.3 241.7 192 224 192zM64 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-96C96 366.3 81.67 352 64 352zM384 320h-32c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-128C416 334.3 401.7 320 384 320z"
                                />
                                <path
                                    className="fa-secondary"
                                    d="M576 48C576 74.5 554.5 96 528 96c-6.125 0-12-1.25-17.38-3.375l-95.38 76.25C415.6 171.3 416 173.6 416 176C416 202.5 394.5 224 368 224S320 202.5 320 176c0-2.375 .375-4.75 .75-7.125L225.4 92.63C220 94.75 214.1 96 208 96C203.8 96 199.6 95.25 195.8 94.25L94.25 195.8C95.25 199.6 96 203.8 96 208C96 234.5 74.5 256 48 256S0 234.5 0 208S21.5 160 48 160c4.25 0 8.375 .75 12.25 1.75l101.5-101.5C160.8 56.37 160 52.25 160 48C160 21.5 181.5 0 208 0S256 21.5 256 48c0 2.375-.375 4.75-.75 7.125l95.38 76.25C356 129.3 361.9 128 368 128s12 1.25 17.38 3.375l95.38-76.25C480.4 52.75 480 50.38 480 48C480 21.5 501.5 0 528 0S576 21.5 576 48z"
                                />
                            </svg>
                            Statistics
                        </h3>
                        <div>
                            <span className="stat_giver">Speed:</span> <span className="stat_reader">{wpm}wpm</span>
                        </div>
                        <div>
                            <span className="stat_giver">Accuracy:</span> <span className="stat_reader">{accuracy}%</span>
                        </div>
                        <div>
                            <span className="stat_giver">Races completed:</span> <span className="stat_reader">{racesTotal}</span>
                        </div>
                        <div>
                            <span className="stat_giver">Races won:</span> <span className="stat_reader">{racesWon}</span>
                        </div>
                        <div>
                            <span className="stat_giver">Fastest race:</span> <span className="stat_reader">{bestRace}wpm</span>
                        </div>
                        <div>
                            <span className="stat_giver">Time spent racing:</span> <span className="stat_reader">{new Date(timeSpentRacing * 1000).toISOString().substring(11, 19)}</span>
                        </div>
                    </div>
                    {shareOpen && (
                        <>
                            <Overlay />
                            <div className="share__modal selector_container">
                                <h1 className="modalCallerHeader kpbb">Share this profile</h1>
                                <div className="close_container">
                                    <button className="close-modal-button" onClick={() => setShareOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                            <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="__btnscontainer">
                                    <button className="refwidth wws btn" onClick={() => handleShare("Successfully copied to clipboard")}>
                                        <svg className="btbsvg nhg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                        </svg>
                                        Copy to clipboard
                                    </button>
                                    <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText)} rel="noreferrer" target="_blank" tabIndex={-1} className="refwidth">
                                        <button className="wws btn twbtn" onClick={() => handleShare("Successfully opened Twitter")}>
                                            <svg className="btbsvg nhg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                                            </svg>
                                            Tweet
                                        </button>
                                    </a>

                                    <a href={"//wa.me/send?text=" + encodeURIComponent(tweetText)} rel="noreferrer" target="_blank" tabIndex={-1} className="refwidth">
                                        <button className="wws btn wabtn" onClick={() => handleShare("Successfully opend WhatsApp")}>
                                            <svg className="btbsvg nhg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                            </svg>
                                            Whatsapp
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
