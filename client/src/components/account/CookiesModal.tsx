import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import Overlay from "../modal/Overlay"
import useEventListener from "@use-it/event-listener"

export default function CookieModal() {
    const [open, setOpen] = useState(false)
    const tab = useRef<any>(null)
    let location = useLocation()

    const handleAccept = () => {
        let date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        window.localStorage.setItem("cookies", JSON.stringify({ allow: true, expires: date }))
        setOpen(false)
    }

    useEffect(() => {
        const store = JSON.parse(window.localStorage.getItem("cookies") as string)
        if (!store || store.allow !== true || (Number(new Date()) - store.date) / (1000 * 3600 * 24 * 365) > 1) {
            if (location.pathname !== "/terms-of-service" && location.pathname !== "/disclaimer") {
                setOpen(true)
            }
        }
        window.scrollTo(0, 0)
    }, [location.pathname])

    const handler = (e: any) => {
        if (open) tab.current.focus()
    }

    useEventListener("keydown", handler)

    return (
        <>
            {open && (
                <>
                    <Overlay />
                    <div className="cookie__modal cm__float">
                        <h2 className="cookies__header">Cookies</h2>
                        <div className="textcontent">
                            <p className="cmdtxt">We only use cookies and data that are necessary to provide and maintain RapidTyper.</p>
                            <p className="cmdtxt">
                                By continuing to use this site, you accept all necessary cookies and agree to comply with our{" "}
                                <a className="cmd_link" href="https://grovider.co/privacy-policy">
                                    Privacy Policy
                                </a>{" "}
                                and our{" "}
                                <Link className="cmd_link" to="/terms-of-service" onClick={() => setOpen(false)}>
                                    Terms of Service
                                </Link>
                                .
                            </p>
                            <div className="_c_buttonset">
                                <button onClick={handleAccept} ref={tab}>
                                    I understand
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
