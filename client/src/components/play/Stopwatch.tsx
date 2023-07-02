import React, { useState, useEffect } from "react"
export default function Stopwatch(props: any) {
    let isRunning: boolean = props.start
    let isReset: boolean = props.reset

    const [time, setTime] = useState(0)

    useEffect(() => {
        let intervalId: any
        if (isReset) {
            setTime(0)
        }
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 100), 1000)
        }
        return () => clearInterval(intervalId)
    }, [isRunning, time, isReset])

    const minutes = Math.floor((time % 360000) / 6000)
    const seconds = Math.floor((time % 6000) / 100)

    return (
        <p>
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </p>
    )
}
