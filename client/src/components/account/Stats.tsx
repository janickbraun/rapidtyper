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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path></svg>
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
                            <div style={{textAlign: "right"}}>
                                <p><span>Your email address has not been verified. Please check your email.</span><span>&nbsp;</span>{" "}<button className="inlinebutton" onClick={() => mutationAnother.mutate()}>Resend email</button></p>
                            </div>
                        )}
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
                </div>
            )}
        </div>
    )
}
