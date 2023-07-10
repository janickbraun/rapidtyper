import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Leaderboard from "./Leaderboard"
import "./home.main.css"
import { unlockSkin } from "../../helpers/skinHelper"
import Overlay from "../modal/Overlay"

function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay))
}

export default function Home() {
    const [loggedin, username, skin] = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const [accountResponse, setAccountResponse] = useState("")
    const [shareOpen, setShareOpen] = useState(false)
    let navigate = useNavigate()

    const message = async (msg: string) => {
        setAccountResponse(msg)
        setSearchParams()
        await timeout(3000)
        setAccountResponse("")
    }

    useEffect(() => {
        const accMsg = async (msg: string, time?: number) => {
            setAccountResponse(msg)
            setSearchParams()
            if (!time) {
                await timeout(3000)
            } else {
                await timeout(time)
            }

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
            accMsg("We sent you an email to verify your email adress. Please check your inbox.", 10000)
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

    const handleSkin = (skin: string) => {
        unlockSkin(skin)
    }

    const handleShare = (msg: string) => {
        message(msg)

        if (msg === "Successfully copied to clipboard") {
            navigator.clipboard.writeText("https://rapidtyper.com")
        }

        setShareOpen(false)
    }

    return (
        <main id="component:home">
            {accountResponse !== "" && (
                <div className="infopopup">
                    {accountResponse}
                    <svg xmlns="http://www.w3.org/2000/svg" className="sndficon" viewBox="0 0 512 512">
                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM296 336h-16V248C280 234.8 269.3 224 256 224H224C210.8 224 200 234.8 200 248S210.8 272 224 272h8v64h-16C202.8 336 192 346.8 192 360S202.8 384 216 384h80c13.25 0 24-10.75 24-24S309.3 336 296 336zM256 192c17.67 0 32-14.33 32-32c0-17.67-14.33-32-32-32S224 142.3 224 160C224 177.7 238.3 192 256 192z" />
                    </svg>
                </div>
            )}
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
                                                        <img src={"/img/skins/" + skin + ".png"} alt="skin" draggable="false" className="user_default_skinimg home_" loading="eager" />
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
                                                {mutationMultiplayer.isError && <div className="cserror">{mutationMultiplayer.error.message}</div>}
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
                            <Link to={"/account/login"} tabIndex={-1}>
                                <button className="secondary_action largebtn">
                                    <span className="btninspan">Login</span>
                                </button>
                            </Link>
                            <Link to={"/account/signup"} tabIndex={-1}>
                                <button className="primary_action largebtn">
                                    <span className="btninspan">Sign up</span>
                                    <figure className="clcionct">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="clgoicon" viewBox="0 0 320 512">
                                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                        </svg>
                                    </figure>
                                </button>
                            </Link>
                            <span>or</span>
                            <Link tabIndex={-1} to="/singleplayer">
                                <button className="secondary_action">Singleplayer</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <Leaderboard />

            {shareOpen && (
                <>
                    <Overlay />
                    <div className="share__modal selector_container">
                        <h1 className="modalCallerHeader kpbb">Share this page</h1>
                        <div className="close_container">
                            <button className="close-modal-button" onClick={() => setShareOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                    <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="__btnscontainer">
                            <button className="refwidth wws btn" onClick={() => handleShare("Successfully copied to clipboard")}>
                                <svg className="btbsvg nhg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                </svg>
                                Copy to clipboard
                            </button>
                            <a
                                href="//twitter.com/intent/tweet?text=%F0%9F%9A%80%20Improve%20your%20typing%20skills%20and%20challenge%20friends%20with%20RapidTyper!%20%F0%9F%8E%AE%F0%9F%94%A5%20Enhance%20your%20speed,%20accuracy,%20and%20have%20fun%20racing%20against%20others.%20Check%20out%20rapidtyper.com%20and%20unlock%20your%20typing%20potential%20today!%20%F0%9F%92%AA%F0%9F%92%BB%20%23typing%20%23skills%20%23competition"
                                rel="noreferrer"
                                target="_blank"
                                tabIndex={-1}
                                className="refwidth"
                            >
                                <button className="wws btn twbtn" onClick={() => handleShare("Successfully opened Twitter")}>
                                    <svg className="btbsvg nhg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                                    </svg>
                                    Tweet
                                </button>
                            </a>

                            <a
                                href="//wa.me/send?text=Improve+your+typing+skills+and+challenge+friends+with+RapidTyper%21+Enhance+your+speed%2C+accuracy%2C+and+have+fun+racing+against+others.+Check+out+https%3A%2F%2Frapidtyper.com+and+unlock+your+typing+potential+today%21"
                                rel="noreferrer"
                                target="_blank"
                                tabIndex={-1}
                                className="refwidth"
                            >
                                <button className="wws btn wabtn" onClick={() => handleShare("Successfully opend WhatsApp")}>
                                    <svg className="btbsvg nhg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                    </svg>
                                    WhatsApp
                                </button>
                            </a>
                        </div>
                    </div>
                </>
            )}
            <div className="__dmf_btst">
                <button onClick={() => handleSkin("bee")} onClickCapture={() => setShareOpen(true)} className="sharebtn__c">
                    Share this page
                    <svg className="btbsvg" style={{ marginLeft: 5 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                    </svg>
                </button>
                <a href="https://www.buymeacoffee.com/rapidtyper" className="dsf_x" target="_blank" rel="noreferrer">
                    <img
                        src="https://img.buymeacoffee.com/button-api/?text=Donate&emoji=&slug=rapidtyper&button_colour=2563eb&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00"
                        alt="Donation"
                        height={40}
                        draggable="false"
                        loading="eager"
                    />
                </a>
            </div>
        </main>
    )
}
