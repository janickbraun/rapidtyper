import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import useAuth from "../../hooks/useAuth"

export default function Stats(props: any) {
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [racesTotal, setRacesTotal] = useState(0)
    const [racesWon, setRacesWon] = useState(0)
    const [bestRace, setBestRace] = useState(0)
    const [date, setDate] = useState("")
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
                <div>
                    <h3>Stats</h3>
                    <div>Speed: {wpm}wpm</div>
                    <div>Accuracy: {accuracy}%</div>
                    <div>Races completed: {racesTotal}</div>
                    <div>Races won: {racesWon}</div>
                    <div>Fastest race: {bestRace}wpm</div>
                    <div>Racing since: {date}</div>
                    <div>
                        Skin: <img src={"/img/skins/" + skin + ".png"} alt="skin" />
                        {loggedin && username === props.username && <button onClick={() => setSkinsOpen(!skinsOpen)}>{skinsOpen ? <>Close</> : <>Change skin</>}</button>}
                        {skinsOpen && (
                            <div>
                                {skins.map((val, key) => {
                                    return (
                                        <div key={key}>
                                            <img onClick={() => handleSkinChange(val)} src={"/img/skins/" + val + ".png"} alt="skin" />
                                        </div>
                                    )
                                })}
                                <div>How to unlock more skins:</div>
                                <ul>
                                    <li>Type faster</li>
                                    <li>Complete and win more races</li>
                                    <li>Improve your accuracy</li>
                                    <li>Look for easter eggs 👀</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
