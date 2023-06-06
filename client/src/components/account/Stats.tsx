import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"

export default function Stats(props: any) {
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [racesTotal, setRacesTotal] = useState(0)
    const [racesWon, setRacesWon] = useState(0)
    const [bestRace, setBestRace] = useState(0)
    const [date, setDate] = useState("")

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
        },
    })

    useEffect(() => {
        if (mutation.isIdle && !hasFired.current) {
            hasFired.current = true
            mutation.mutate()
        }
    }, [mutation])

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
                </div>
            )}
        </div>
    )
}
