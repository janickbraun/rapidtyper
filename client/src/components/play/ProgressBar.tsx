import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link } from "react-router-dom"

const ProgressBar = (props: any) => {
    const { completed, name, skin, online, done, connected } = props
    const [isOpen, setIsOpen] = useState(false)

    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [racesTotal, setRacesTotal] = useState(0)
    const [racesWon, setRacesWon] = useState(0)
    const [bestRace, setBestRace] = useState(0)
    const [timeSpentRacing, setTimeSpentRacing] = useState(0)
    const [date, setDate] = useState("")
    const [country, setCountry] = useState("")

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
    })

    const containerStyles = {
        height: 20,
        borderRadius: "50rem",
        margin: "6rem 50px 2rem",
    }

    const fillerStyles: any = {
        height: "100%",
        width: `${completed}%`,
        borderRadius: "inherit",
        textAlign: "right",
        position: "relative",
    }

    const labelStyles: object = {
        padding: 5,
        color: "#fff",
        fontWeight: "bold",
        top: "200%",
        transform: "translate(-0px, -138%)",
        position: "absolute",
        width: 100,
        textAlign: "left",
        left: "auto",
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
                <span style={labelStyles}>
                    <div onMouseEnter={handleGetStats} onMouseLeave={() => setIsOpen(!isOpen)}>
                        {done && online ? (
                            <Link to={"/user/" + name} reloadDocument={true} className="wnc">
                                <span className="__namedisplay">{name}</span>
                                <span className="__percentdisplay">{Math.round(completed)}%</span>
                                {skin && <img style={{ width: 50, height: 50, position: "absolute" }} src={"/img/skins/" + skin + ".png"} alt="skin" />}
                            </Link>
                        ) : (
                            <div className="wnc">
                                <p style={{ width: "max-content" }}>
                                    <span className="__namedisplay">{name}</span>
                                    <span className="__percentdisplay">{Math.round(completed)}%</span>
                                </p>
                                {skin && <img style={{ width: 60, height: 60, transform: "translateY(6px)" }} src={"/img/skins/" + skin + ".png"} alt="skin" className="cupimg" />}
                            </div>
                        )}
                    </div>

                    {/* onHover -> show player info. | Ignore */}
                    {isOpen && online && (
                        <div style={{ position: "absolute", border: "4px solid red", width: "max-content" }}>
                            {name}
                            {mutation.isSuccess ? (
                                <>
                                    <img className="user_origincounty uoc_wbd" src={"https://flagicons.lipis.dev/flags/1x1/" + country + ".svg"} loading="lazy" draggable="false" alt="" />

                                    <div>Speed: {wpm}wpm</div>
                                    <div>Accuracy: {accuracy}%</div>
                                    <div>Races completed: {racesTotal}</div>
                                    <div>Races won: {racesWon}</div>
                                    <div>Fastest race: {bestRace}wpm</div>
                                    <div>Time spent racing: {new Date(timeSpentRacing * 1000).toISOString().substring(11, 19)}</div>
                                    <div>Racing since: {date}</div>
                                </>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    )}
                    {/* end */}
                </span>
                {!connected && 
                    <div className="disconnectHint">
                        <svg xmlns="http://www.w3.org/2000/svg" className="disconnectSVG" viewBox="0 -960 960 960">
                            <path d="M382-120v-118L240-394v-215q0-25 17-42.5t41-17.5v84L67-816l42-42 750 750-42 42-207-207-32 35v118H382Zm310-240L342-710v-130h60v171h156v-171h60v201l-30-30h72q25 0 42.5 17.5T720-609v217l-28 32Z"/>
                        </svg>Disconnected
                    </div>
                }
            </div>
        </div>
    )
}

export default ProgressBar
