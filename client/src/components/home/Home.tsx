import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Leaderboard from "./Leaderboard"
import "./home.main.css"

function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay))
}

export default function Home() {
    const [loggedin, username, skin] = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const [accountResponse, setAccountResponse] = useState("")
    let navigate = useNavigate()

    useEffect(() => {
        const accMsg = async (msg: string) => {
            setAccountResponse(msg)
            setSearchParams()
            await timeout(3000)
            setAccountResponse("")
        }

        document.title = "RapidTyper"
        if (localStorage.getItem("back") === "true") {
            localStorage.removeItem("back")
            window.location.reload()
        }

        if (searchParams.get("login")) {
            accMsg("Successfully logged in")
        } else if (searchParams.get("signup")) {
            accMsg("Successfully signed up")
        } else if (searchParams.get("delete")) {
            accMsg("Successfully deleted account")
        } else if (searchParams.get("logout")) {
            accMsg("Successfully logged out")
        }
    }, [navigate, searchParams, setSearchParams])

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
            {accountResponse !== "" && <div>{accountResponse}</div>}
            {loggedin && (
                <>
                    <div className="account_supercontainer">
                        <div className="asc__inner">
                            <div className="profile_split">
                                <div className="pscfix">
                                    <div className="profile_information">
                                        <div className="_profileinfinner">
                                            <Link tabIndex={-1} to={"/user/" + username} style={{ display: "inherit", alignItems: "inherit", justifyContent: "inherit" }} className="userlink_ds">
                                                <div className="_profile_skinct">
                                                    <figure className="__userhmskin">
                                                        <img src={"/img/skins/" + skin + ".png"} alt="skin" draggable="false" className="user_default_skinimg home_" />
                                                    </figure>
                                                </div>
                                                <div className="_profile_nameset">
                                                    <h1>Welcome, {username}</h1>
                                                </div>
                                                <div className="flicon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="ac__go" viewBox="0 0 448 512">
                                                        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                                    </svg>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                <div className="profile_actionset">
                                    <div className="__buttonset">
                                        <>
                                            {/* <button  className="largebtn">Play multiplayer</button> */}
                                            <button onClick={handleMultiplayer} className="noscale">
                                                <div className="nv-groupsvg">
                                                    <svg className="cnvsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                                                    </svg>
                                                </div>
                                                <div className="nvt">
                                                    <h2 className="link_call large">Multiplayer</h2>
                                                    <p className="description_sd2">Race against others</p>
                                                </div>
                                            </button>
                                            {mutationMultiplayer.isError && <div>{mutationMultiplayer.error.message}</div>}
                                        </>
                                        <Link tabIndex={-1} to="/singleplayer">
                                            <button className="noscale">
                                                <div className="nv-groupsvg">
                                                    <svg className="cnvsvg h37" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                                    </svg>
                                                </div>
                                                <div className="nvt">
                                                    <h2 className="link_call large">Singleplayer</h2>
                                                    <p className="description_sd2">Practice your typing</p>
                                                </div>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {loggedin ? (
                ""
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
                            <Link to={"/account#login"} tabIndex={-1}>
                                <button className="secondary_action largebtn">
                                    <span className="btninspan">Login</span>
                                </button>
                            </Link>
                            <Link to={"/account#signup"} tabIndex={-1}>
                                <button className="primary_action largebtn">
                                    <span className="btninspan">Sign up</span>
                                    <figure className="clcionct">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="clgoicon" viewBox="0 0 320 512">
                                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                        </svg>
                                    </figure>
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
