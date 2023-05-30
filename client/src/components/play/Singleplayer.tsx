import React, { useEffect, useRef, useState } from "react"
import ProgressBar from "./ProgressBar"

export default function Singleplayer() {
    const [textArray, setTextArray] = useState([]) as any
    const [currentIndex, setCurrentIndex] = useState(0)
    const [startDateTime, setStartDateTime] = useState(0)
    const [completed, setCompleted] = useState(0)
    const [mistakes, setMistakes] = useState(0)

    const text = "If you think that you are going to love something, give it a try. You're going to kick yourself in the butt for the rest of your life if you don't." //
    const hasFired = useRef(false)
    const spitted = text.split("")
    let arr: any = []
    for (let i = 0; i < spitted.length; i += 1) {
        arr.push({ character: spitted[i], correct: undefined })
    }

    useEffect(() => {
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
        setCurrentIndex(0)
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

        if (e.key === spitted[currentIndex] && currentIndex < spitted.length) {
            if (currentIndex === 0) setStartDateTime(new Date().getTime())
            let temp = textArray
            temp[currentIndex].correct = true
            setTextArray(temp)
            setCurrentIndex(currentIndex + 1)
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
                let seconds = Math.abs((new Date().getTime() - startDateTime) / 1000)
                const wpm = spitted.length / 5 / (seconds / 60)
                const accuracy = ((spitted.length - mistakes) / spitted.length) * 100

                console.log("Time: " + Math.round(seconds))
                console.log("Wpm: " + wpm)
                console.log("Accuracy: " + accuracy)
            }
        }
    }

    return (
        <main>
            <h3>Singleplayer</h3>
            <ProgressBar bgcolor={"#6a1b9a"} completed={(currentIndex / spitted.length) * 100} />
            <div style={{ position: "absolute", left: 10, top: 300 }}>{listItems}</div>

            <button onClick={handleRestart}>Restart</button>
        </main>
    )
}
