import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import "./header.css"
import useIsInGame from "../../hooks/useIsInGame"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useWindowSize } from "react-use"

export default function Header({ children }: { children: React.ReactNode }) {
    const [loggedin, username] = useAuth()
    const [isInGame] = useIsInGame()

    const { width } = useWindowSize()

    const [open, setOpen] = useState<boolean>(false)
    const dropRef = useRef<HTMLUListElement>(null)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [showNav, setShowNav] = useState(windowWidth > 750)

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    let location = useLocation()

    useEffect(() => {
        setShowNav(false)
    }, [location])

    useEffect(() => {
        setShowNav(windowWidth > 750)
    }, [windowWidth])

    const handleClick = () => {
        setShowNav(!showNav)
    }

    const focus = (state: boolean) => {
        setOpen(!state)
    }

    let navigate = useNavigate()

    const token = localStorage.getItem("token")

    const mutationMultiplayer: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/multiplayer", { token })
        },
        onSuccess: ({ data }) => {
            navigate("/multiplayer/" + data.code)
        },
    })

    return (
        <div>
            {open && <div className="modal-backdrop-nav" onClick={() => setOpen(false)}></div>}
            <nav className="rt_navigation default_nav">
                <div className="navigation-logo container-nav">
                    <Link to="/" className="logoContainer" reloadDocument={isInGame} onClick={() => setOpen(false)}>
                        <img src="/img/rapidtyper-logo.png" alt="Logo" className="src_logo" />
                    </Link>
                </div>
                <div className="navigation-link container-nav">
                    {width <= 750 && (
                        <button onClick={handleClick} className="specialbtn toggleNav">
                            <svg xmlns="http://www.w3.org/2000/svg" className="nvsvg" viewBox="0 0 448 512">
                                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                            </svg>
                        </button>
                    )}
                    {windowWidth > 750 || showNav ? (
                        <ul className="_linklisting">
                            <li className="nav-link-item">
                                <Link to="/shop" reloadDocument={isInGame} onClick={() => setOpen(false)}>
                                    <span className="link_call">Shop</span>
                                </Link>
                            </li>
                            <li className="nav-link-item">
                                <Link to="/about" reloadDocument={isInGame} onClick={() => setOpen(false)}>
                                    <span className="link_call">About</span>
                                </Link>
                            </li>
                            <li className="nav-link-item">
                                <button onClick={() => focus(open)} style={{ padding: "9px 14px" }}>
                                    <span className="link_call">Play</span>
                                    <span className="navicon">
                                        <svg className="d-svg " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                                        </svg>
                                    </span>
                                </button>
                                {open && (
                                    <ul className="dropdown_container" ref={dropRef}>
                                        <li className="dropdown_item" style={{ marginBottom: 14 }}>
                                            <Link to="/singleplayer" style={{ width: "100%" }} className="noscale" reloadDocument={isInGame} onClick={() => setOpen(false)}>
                                                <div className="nv-groupsvg">
                                                    <svg className="cnvsvg h37" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                                    </svg>
                                                </div>
                                                <div className="nvt">
                                                    <h2 className="link_call large">Singleplayer</h2>
                                                    <p className="description_sd2">Practice your typing</p>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="dropdown_item">
                                            <button
                                                onClick={() => {
                                                    if (loggedin) {
                                                        mutationMultiplayer.mutate()
                                                    } else {
                                                        navigate("/account/login")
                                                    }
                                                    setOpen(false)
                                                }}
                                                className="noscale"
                                            >
                                                <div className="nv-groupsvg">
                                                    <svg className="cnvsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                                                    </svg>
                                                </div>
                                                <div className="nvt">
                                                    <h2 className="link_call large">Multiplayer</h2>
                                                    <p className="description_sd2">
                                                        {loggedin ? (
                                                            <>Compete against others</>
                                                        ) : (
                                                            <>
                                                                Please <u>login</u> to play
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li className="nav-link-item">
                                <Link reloadDocument={isInGame} to={loggedin ? "/account" : "/account/login"} onClick={() => setOpen(false)}>
                                    {loggedin ? <span className="link_call">{username}</span> : <span className="link_call">Login</span>}
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        ""
                    )}
                </div>
            </nav>
            {children}
        </div>
    )
}
