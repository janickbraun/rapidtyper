import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Leaderboard from "./Leaderboard"
import "./home.main.css"

export default function Home() {
    const [loggedin, username] = useAuth()
    let navigate = useNavigate()

    useEffect(() => {
        document.title = "RapidTyper"
        if (localStorage.getItem("back") === "true") {
            localStorage.removeItem("back")
            window.location.reload()
        }
    }, [navigate])

    const token = localStorage.getItem("token")

    const mutationMultiplayer: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/multiplayer", { token })
        },
        onSuccess: ({ data }) => {
            navigate("/multiplayer/" + data.code)
        },
    })

    const handleMultiplayer = () => {
        mutationMultiplayer.mutate()
    }

    return (
        <main>
            {loggedin && (
                <>
                    <Link tabIndex={-1} to={"/user/" + username}>
                        <button>Profile</button>
                    </Link>{" "}
                </>
            )}
            <br />
            <br />
            <Link tabIndex={-1} to="/singleplayer">
                <button>Singleplayer</button>
            </Link>{" "}
            {loggedin ? (
                <>
                    <button onClick={handleMultiplayer}>Multiplayer</button>
                    {mutationMultiplayer.isError && <div>{mutationMultiplayer.error.message}</div>}
                </>
            ) : (
                <div className="login_hint hct takeover_trans2"> 
                    <div className="loginhint_inner">
                        <div className="loginhintheader">
                            <h1 className="trcaller">Unlock more</h1>
                        </div>
                        <div className="lowerhintbody cl">
                            <p className="complete">Unlock skins, play multiplayer, and discover other amazing features exclusively for registered users.</p>
                        </div>
                        <div className="buttons_callercontainer">
                            <Link to={"/account#login"}>
                                <button className="secondary_action largebtn">
                                    <span className="btninspan">Login</span>
                                </button>
                            </Link>
                            <Link to={"/account#signup"}>
                                <button className="primary_action largebtn">
                                    <span className="btninspan">Signup</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="clgoicon" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <Leaderboard />
        </main>
    )
}
