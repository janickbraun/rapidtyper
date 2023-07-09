import React, { useEffect, useState } from "react"

function secondsToHms(d: any) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor((d % 3600) / 60)
    var s = Math.floor((d % 3600) % 60)

    var hDisplay = h > 0 ? ("0" + h).slice(-2) + ":" : "00"
    var mDisplay = m > 0 ? ("0" + m).slice(-2) + ":" : "00"
    var sDisplay = s > 0 ? ("0" + s).slice(-2) : "00"
    return hDisplay + mDisplay + sDisplay
}

export default function CountDown(props: any) {
    const [time, setTime] = useState("")
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        setSeconds(props.seconds)
    }, [props.seconds])

    useEffect(() => {
        setTime(secondsToHms(seconds))
    }, [seconds])

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [seconds])

    return <>{time !== "" && time}</>
}
