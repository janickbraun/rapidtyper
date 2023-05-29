import React, { useEffect, useRef, useState } from "react"

export default function Singleplayer() {
    const [textArray, setTextArray] = useState([]) as any
    const [currentIndex, setCurrentIndex] = useState(0)
    const [startDateTime, setStartDateTime] = useState(0)

    const text = "das ist ein test"
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
                console.log(seconds)
            }
        }
        //console.log(e.key)
    }

    return (
        <main>
            <h3>Singleplayer</h3>
            {listItems}
        </main>
    )
}
