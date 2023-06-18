import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link } from "react-router-dom"

const ProgressBar = (props: any) => {
    const { bgcolor, completed, name, skin, online, done, connected } = props
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
        margin: 50,
    }

    const fillerStyles: any = {
        height: "100%",
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: "inherit",
        textAlign: "right",
        position: "relative",
    }

    let color: string = "black"

    if (completed >= 97) {
        color = "white"
    } else {
        color = "black"
    }

    const labelStyles: object = {
        padding: 5,
        color: color,
        fontWeight: "bold",
        top: "200%",
        transform: "translate(-0px, -138%)",
        position: "absolute",
        width: 100,
        textAlign: "left",
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
                            <Link to={"/user/" + name} reloadDocument={true}>
                                {name}
                            </Link>
                        ) : (
                            <>{name}</>
                        )}
                    </div>
                    {Math.round(completed)}%{skin && <img style={{ width: 50, height: 50, position: "absolute" }} src={"/img/skins/" + skin + ".png"} alt="skin" />}

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
                {!connected && <div>Disconnected</div>}
            </div>
        </div>
    )
}

export default ProgressBar
