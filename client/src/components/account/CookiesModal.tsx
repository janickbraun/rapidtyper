import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

export default function CookieModal() {
    const [open, setOpen] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    let location = useLocation()

    const handleWrong = () => {
        setErrMsg("In order to use rapidtyper.com you need to accept nessessary cookies.")
    }

    const handleAccept = () => {
        let date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        window.localStorage.setItem("cookies", JSON.stringify({ allow: true, expires: date }))
        setErrMsg("")
        setOpen(false)
    }

    useEffect(() => {
        const store = JSON.parse(window.localStorage.getItem("cookies") as string)
        if (!store || store.allow !== true || (Number(new Date()) - store.date) / (1000 * 3600 * 24 * 365) > 1) {
            if (location.pathname !== "/terms-of-service") {
                setOpen(true)
            }
        }
    }, [location.pathname])

    return (
        <>
            {open && (
                <div style={{ marginTop: 100 }}>
                    <h2>Cookies</h2>
                    We are only using nessessary cookies and data to deliver and maintain rapidtyper.com
                    <br />
                    <strong>
                        By accepting the coockies you also comply with our terms of service <a href="https://grovider.co/privacy-policy">privacy policy</a> and our{" "}
                        <Link to="/terms-of-service" onClick={() => setOpen(false)}>
                            terms & conditions of use
                        </Link>
                        .
                    </strong>
                    <br /> <br />
                    Please accept all nessessary cookies to be able to use rapidtyper.com
                    <p>{errMsg}</p>
                    <button onClick={handleWrong}>I decline</button>
                    <button onClick={handleAccept}>I accept all</button>
                </div>
            )}
        </>
    )
}
