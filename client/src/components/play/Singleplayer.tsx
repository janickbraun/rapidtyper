import React, { useEffect, useMemo, useRef, useState } from "react"
import ProgressBar from "./ProgressBar"

export default function Singleplayer() {
    const [textArray, setTextArray] = useState([]) as any
    const [currentIndex, setCurrentIndex] = useState(0)
    const [startDateTime, setStartDateTime] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [time, setTime] = useState<number>(0)
    const [accuracy, setAccuracy] = useState<number>(0)
    const [wpm, setWpm] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)

    const text = "jjjjjjjjjj"
    const hasFired = useRef(false)
    const spitted = text.split("")
    let arr: any = useMemo(() => [], [])
    for (let i = 0; i < spitted.length; i += 1) {
        arr.push({ character: spitted[i], correct: undefined })
    }

    useEffect(() => {
        document.title = "Singleplayer - RapidTyper"
        if (!hasFired.current) {
            hasFired.current = true
            setTextArray(arr)
        }
    }, [setTextArray, text, arr])

    const listItems = textArray.map((element: any, i: number) => (
        <div style={{ display: "inline-flex" }} key={i}>
            {element.character === " " ? (
                <>
                    {element.correct === undefined && <div style={{ display: "inline" }}>&nbsp;</div>}
                    {element.correct && <div style={{ display: "inline", background: "limegreen" }}>&nbsp;</div>}
                    {element.correct === false && <div style={{ display: "inline", background: "red" }}>&nbsp;</div>}
                </>
            ) : (
                <>
                    {element.correct === undefined && <div style={{ display: "inline" }}>{element.character}</div>}
                    {element.correct && <div style={{ display: "inline", background: "limegreen" }}>{element.character}</div>}
                    {element.correct === false && <div style={{ display: "inline", background: "red" }}>{element.character}</div>}
                </>
            )}
        </div>
    ))

    const handleRestart = (e: any) => {
        setDone(false)
        setCurrentIndex(0)
        setAccuracy(0)
        setMistakes(0)
        setCompleted(0)
        setTime(0)
        setWpm(0)
        let temp = textArray
        for (let i = 0; i < spitted.length; i += 1) {
            temp[i].correct = undefined
        }
        setTextArray(temp)
        e.currentTarget.blur()
    }

    document.onkeydown = (e) => {
        const noFire = ["Shift", "CapsLock", "Tab"]

        if (noFire.includes(e.key)) return
        if (done) return

        if (e.key === spitted[currentIndex] && currentIndex < spitted.length) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            let temp = textArray
            temp[currentIndex].correct = true
            setTextArray(temp)
            setCurrentIndex(currentIndex + 1)

            let allCorrect = true
            for (let i = 0; i < currentIndex + 1; i += 1) {
                if (!textArray[i].correct) {
                    allCorrect = false
                    break
                }
            }
            if (allCorrect) setCompleted(currentIndex)
        } else if (e.key === "Backspace" && e.ctrlKey) {
            if (currentIndex === 0) return
            let temp = textArray
            let times = 1
            temp[currentIndex - 1].correct = undefined
            for (let i = currentIndex - 1; i > 0; i -= 1) {
                if (temp[i - 1].character === " ") break
                temp[i - 1].correct = undefined
                times += 1
            }
            setCurrentIndex(currentIndex - times)
            setTextArray(temp)
        } else if (e.key === "Backspace") {
            if (currentIndex === 0) return
            let temp = textArray
            temp[currentIndex - 1].correct = undefined
            setTextArray(temp)
            setCurrentIndex(currentIndex - 1)
        } else if (currentIndex < spitted.length && !e.ctrlKey) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            let temp = textArray
            temp[currentIndex].correct = false
            setMistakes(mistakes + 1)
            setTextArray(temp)
            setCurrentIndex(currentIndex + 1)
        }

        if (currentIndex === spitted.length - 1) {
            let allCorrect = true
            for (let i = 0; i < spitted.length; i += 1) {
                if (!textArray[i].correct) {
                    allCorrect = false
                    break
                }
            }
            if (allCorrect) {
                const seconds = Number(Math.abs((new Date().getTime() - startDateTime) / 1000).toFixed(2))
                const wpm = Number((spitted.length / 5 / (seconds / 60)).toFixed(2))
                const accuracy = Number((((spitted.length - mistakes) / spitted.length) * 100).toFixed(2))

                setTime(seconds)
                setDone(true)
                setCompleted(currentIndex + 1)
                setWpm(wpm)
                setAccuracy(accuracy)
            }
        }
    }

    return (
        <main>
            <h3>Singleplayer</h3>
            <ProgressBar bgcolor={"#6a1b9a"} completed={(completed / spitted.length) * 100} />
            <div style={{ position: "absolute", left: 10 }}>{listItems}</div>
            <br />
            <br />
            {done && (
                <>
                    <div>Speed: {wpm} wpm</div>
                    <div>Accouracy: {accuracy}%</div>
                    <div>Time: {time} seconds</div>
                </>
            )}

            <button onClick={handleRestart}>Restart</button>
        </main>
    )
}
