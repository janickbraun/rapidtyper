import React, { useEffect, useRef, useState } from "react"

export default function Singleplayer() {
    const [textArray, setTextArray] = useState([]) as any
    const [currentIndex, setCurrentIndex] = useState(0)

    const text = "das ist ein test"
    const hasFired = useRef(false)
    const spitted = text.split("")
    let arr: any = []
    for (let i = 0; i < spitted.length; i += 1) {
        arr.push({ character: spitted[i], typed: false, correct: true })
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
                <>&nbsp;</>
            ) : (
                <>{!element.typed ? <div style={{ display: "inline" }}>{element.character}</div> : <div style={{ display: "inline", color: "limegreen" }}>{element.character}</div>}</>
            )}
        </div>
    ))

    document.onkeydown = (e) => {
        if (e.key === "Shift" || e.key === "CapsLock") return
        if (e.key === spitted[currentIndex]) {
            let temp = textArray
            temp[currentIndex].typed = true
            setTextArray(temp)
            setCurrentIndex(currentIndex + 1)
        } else {
            console.log("False: " + e.key)
        }
        //console.log(e.key)
    }

    return (
        <div>
            <h3>Singleplayer</h3>
            {listItems}
        </div>
    )
}
