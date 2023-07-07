import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useEffectOnce } from "react-use"

const ProgressBar = (props: any) => {
    const { completed, name, skin, online, done, connected, zindexkey } = props
    const [isOpen, setIsOpen] = useState(false)

    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [racesTotal, setRacesTotal] = useState(0)
    const [racesWon, setRacesWon] = useState(0)
    const [bestRace, setBestRace] = useState(0)
    const [timeSpentRacing, setTimeSpentRacing] = useState(0)
    const [date, setDate] = useState("")
    const [country, setCountry] = useState("")
    const [key, setKey] = useState(0)

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/getstats", { username: name })
        },
        onSuccess: ({ data }) => {
            setWpm(data.wpm)
            setAccuracy(data.accuracy)
            setRacesTotal(data.racesTotal)
            setRacesWon(data.racesWon)
            setBestRace(data.bestRace)
            setDate(data.date)
            setCountry(data.country)
            setTimeSpentRacing(data.time)
        },
        onError: () => {
            "Cannot load stats"
        },
    })

    useEffectOnce(() => {
        setKey(zindexkey + 1)
    })

    const containerStyles = {
        height: 20,
        borderRadius: "50rem",
        margin: "6rem 50px 2rem",
        zIndex: 45 - (key + 1),
    }

    const fillerStyles: any = {
        height: "100%",
        width: `calc(${completed}% + 6%)`,
        minWidth: "inherit",
        borderRadius: "inherit",
        textAlign: "right",
        position: "relative",
    }

    const labelStyles: object = {
        padding: 5,
        color: "#fff",
        fontWeight: "bold",
        top: "200%",
        transform: "translate(-0px, -75%)",
        width: "100px",
        textAlign: "left",
        left: "auto",
        display: "inline-block",
        zIndex: "20",
    }

    const handleGetStats = () => {
        if (country === "" && online) {
            mutation.mutate()
        }
        if (online) setIsOpen(!isOpen)
    }

    return (
        <div style={containerStyles} className="default_PGBAR">
            <div style={fillerStyles}>
                <div style={labelStyles}>
                    <div onMouseEnter={handleGetStats} onMouseLeave={() => setIsOpen(!isOpen)} style={{ zIndex: "400", cursor: "help" }}>
                        {done && online ? (
                            <Link className="wnc" to={"/user/" + name} reloadDocument={true} style={{ display: "flex" }}>
                                <p style={{ width: "max-content" }}>
                                    <span className="__namedisplay">{name}</span>
                                    <span className="__percentdisplay">{Math.round(completed)}%</span>
                                </p>
                                {skin && <img style={{ width: 60, height: 60, transform: "translateY(6px)" }} src={"/img/skins/" + skin + ".png"} alt="skin" className="cupimg" />}
                            </Link>
                        ) : (
                            <div className="wnc">
                                <p style={{ width: "max-content" }}>
                                    <span className="__namedisplay">{name}</span>
                                    <span className="__percentdisplay">{Math.round(completed)}%</span>
                                </p>
                                {skin && <img style={{ width: 60, height: 60, transform: "translateY(6px)" }} src={"/img/skins/" + skin + ".png"} alt={"Skin " + skin} className="cupimg" />}
                            </div>
                        )}
                    </div>
                    {!connected && (
                        <div className="disconnectHint">
                            <svg className="disconnectSVG" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 64 64">
                                <path d="M 55.599609 6.9453125 C 55.087859 6.9453125 54.576047 7.14075 54.185547 7.53125 L 48.716797 13 L 46.240234 10.525391 C 44.680234 8.9653906 42.143984 8.9653906 40.583984 10.525391 L 32.451172 18.65625 L 31.390625 17.595703 C 30.609625 16.814703 29.3435 16.814703 28.5625 17.595703 C 27.7815 18.376703 27.7815 19.642828 28.5625 20.423828 L 31.820312 23.683594 L 27.394531 28.109375 C 26.613531 28.890375 26.613531 30.1565 27.394531 30.9375 C 28.176531 31.7195 29.441656 31.7185 30.222656 30.9375 L 34.648438 26.511719 L 38.150391 30.011719 L 33.587891 34.574219 C 32.806891 35.355219 32.806891 36.621344 33.587891 37.402344 C 34.369891 38.184344 35.635016 38.183344 36.416016 37.402344 L 40.978516 32.839844 L 44.296875 36.158203 C 45.077875 36.939203 46.344 36.939203 47.125 36.158203 C 47.906 35.377203 47.906 34.111078 47.125 33.330078 L 46.064453 32.269531 L 54.195312 24.136719 C 55.755313 22.576719 55.755313 20.040469 54.195312 18.480469 L 51.544922 15.828125 L 57.013672 10.359375 C 57.794672 9.578375 57.794672 8.31225 57.013672 7.53125 C 56.623172 7.14075 56.111359 6.9453125 55.599609 6.9453125 z M 17.990234 28.013672 C 17.478484 28.013672 16.966672 28.209109 16.576172 28.599609 C 15.795172 29.380609 15.795172 30.646734 16.576172 31.427734 L 17.638672 32.488281 L 9.5058594 40.621094 C 7.9458594 42.181094 7.9458594 44.717344 9.5058594 46.277344 L 12.158203 48.929688 L 6.4941406 54.570312 C 5.7131406 55.351312 5.7131406 56.617438 6.4941406 57.398438 C 7.2751406 58.179438 8.5412656 58.179437 9.3222656 57.398438 L 14.986328 51.757812 L 17.460938 54.232422 C 19.020938 55.792422 21.557188 55.792422 23.117188 54.232422 L 31.25 46.101562 L 32.310547 47.162109 C 33.091547 47.943109 34.357672 47.943109 35.138672 47.162109 C 35.919672 46.381109 35.919672 45.114984 35.138672 44.333984 L 19.404297 28.599609 C 19.013797 28.209109 18.501984 28.013672 17.990234 28.013672 z"/>
                            </svg>
                            <p>Disconnected</p>
                        </div>
                    )}
                    {isOpen && online && (
                        <div className="onHoverContainer usercontentcontainer" style={{ order: 2, zIndex: 10000 + 1 }}>
                            {mutation.isSuccess ? (
                                <>
                                    <p className="username_d">
                                        {name}
                                        <img
                                            className="user_origincounty uoc_wbd flxd34"
                                            src={"https://flagicons.lipis.dev/flags/1x1/" + country + ".svg"}
                                            loading="lazy"
                                            draggable="false"
                                            alt={country}
                                        />
                                    </p>

                                    <div>
                                        <span className="small_caller">Speed:</span>&nbsp;&nbsp;<span className="small_namer">{wpm}wpm</span>
                                    </div>
                                    <div>
                                        <span className="small_caller">Accuracy:</span>&nbsp;&nbsp;<span className="small_namer">{accuracy}%</span>
                                    </div>
                                    <div>
                                        <span className="small_caller">Races completed:</span>&nbsp;&nbsp;<span className="small_namer">{racesTotal}</span>
                                    </div>
                                    <div>
                                        <span className="small_caller">Races won:</span>&nbsp;&nbsp;<span className="small_namer">{racesWon}</span>
                                    </div>
                                    <div>
                                        <span className="small_caller">Fastest race:</span>&nbsp;&nbsp;<span className="small_namer">{bestRace}wpm</span>
                                    </div>
                                    <div>
                                        <span className="small_caller">Time spent racing:</span>&nbsp;&nbsp;
                                        <span className="small_namer">{new Date(timeSpentRacing * 1000).toISOString().substring(11, 19)}</span>
                                    </div>
                                    <div>
                                        <span className="small_caller">Racing since:</span>&nbsp;&nbsp;<span className="small_namer">{date}</span>
                                    </div>
                                </>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    )}
                    {/* end */}
                </div>
            </div>
        </div>
    )
}

export default ProgressBar
