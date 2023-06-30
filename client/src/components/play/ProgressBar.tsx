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
        zIndex :"20"
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
                    <div onMouseEnter={handleGetStats} onMouseLeave={() => setIsOpen(!isOpen)} style={{zIndex: "400"}}>
                        {done && online ? (
                            <Link className="wnc" to={"/user/" + name} reloadDocument={true} style={{display: "flex"}}>
                                <p style={{ width: "max-content" }}>
                                    <span className="__namedisplay">{name}</span>
                                    <span className="__percentdisplay">{Math.round(completed)}%</span>
                                </p>
                                {skin && <img style={{ width: 60, height: 60, transform: "translateY(6px)" }} src={"/img/skins/" + skin + ".png"} alt="skin" className="cupimg"/>}
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
                    {/* {isOpen && online && ( */}
                        <div className="onHoverContainer usercontentcontainer">
                            {mutation.isSuccess ? (
                                <>
                                    <p className="username_d">
                                    {name}
                                    <img className="user_origincounty uoc_wbd flxd34" src={"https://flagicons.lipis.dev/flags/1x1/" + country + ".svg"} loading="lazy" draggable="false" alt={country} />
                                    </p>

                                    <div><span className="small_caller">Speed:</span>&nbsp;&nbsp;<span className="small_namer">{wpm}wpm</span></div>
                                    <div><span className="small_caller">Accuracy:</span>&nbsp;&nbsp;<span className="small_namer">{accuracy}%</span></div>
                                    <div><span className="small_caller">Races completed:</span>&nbsp;&nbsp;<span className="small_namer">{racesTotal}</span></div>
                                    <div><span className="small_caller">Races won:</span>&nbsp;&nbsp;<span className="small_namer">{racesWon}</span></div>
                                    <div><span className="small_caller">Fastest race:</span>&nbsp;&nbsp;<span className="small_namer">{bestRace}wpm</span></div>
                                    <div><span className="small_caller">Time spent racing:</span>&nbsp;&nbsp;<span className="small_namer">{new Date(timeSpentRacing * 1000).toISOString().substring(11, 19)}</span></div>
                                    <div><span className="small_caller">Racing since:</span>&nbsp;&nbsp;<span className="small_namer">{date}</span></div>
                                </>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    {/* )} */}
                    {/* end */}
                </div>
                {!connected && 
                    <div className="disconnectHint">
                        <svg className="disconnectSVG" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M897-526q-88-84-192.5-134T480-710q-37 0-71 4.5T352-693l-73-73q44-16 95.5-25t105.5-9q140 0 263.5 58T960-589l-63 63ZM728-357q-33-32-60-51.5T599-447L486-560q95 2 167.5 39T791-420l-63 63Zm77 288L411-463q-54 13-99.5 42T232-357l-63-63q37-37 76.5-65t94.5-50L229-646q-47 23-89 54.5T63-526L0-589q36-37 77-69t84-55l-92-92 43-43 736 736-43 43Zm-325-40L332-258q29-29 66.5-45.5T480-320q44 0 81.5 16.5T628-258L480-109Z"/></svg>
                        <p>Disconnected</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProgressBar
