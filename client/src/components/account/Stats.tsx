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

    const [loggedin, username] = useAuth()

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
                                        x
                                    </button>
                                </div>
                                <div className="skin_div">
                                    {skins.map((val, key) => {
                                        return (
                                            <div key={key}>
                                                <img
                                                    onClick={() => handleSkinChange(val)}
                                                    src={"/img/skins/" + val + ".png"}
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
                                <img className="user_origincounty" src={"https://flagicons.lipis.dev/flags/1x1/" + country + ".svg"} loading="lazy" draggable="false" alt="" />
                            </h1>
                            <div>Racing since: {date}</div>
                        </div>
                    </div>
                    <h3>Stats</h3>
                    <div>Speed: {wpm}wpm</div>
                    <div>Accuracy: {accuracy}%</div>
                    <div>Races completed: {racesTotal}</div>
                    <div>Races won: {racesWon}</div>
                    <div>Fastest race: {bestRace}wpm</div>
                    <div>Time spent racing: {new Date(timeSpentRacing * 1000).toISOString().substring(11, 19)}</div>
                </div>
            )}
        </div>
    )
}
