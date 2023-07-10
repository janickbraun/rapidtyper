import React, { useEffect, useState } from "react"
import Logout from "./Logout"
import Delete from "./Delete"
import useAuth from "../../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import ChangeName from "./ChangeName"
import ChangeCountry from "./ChangeCountry"
import ChangePassword from "./ChangePassword"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import ChangeEmail from "./ChangeEmail"
import Overlay from "../modal/Overlay"

export default function Account() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedin, username, skin, verified, email] = useAuth()
    const navigate = useNavigate()

    const [changeNameOpen, setChangeNameOpen] = useState(false)
    const [changeEmailOpen, setChangeEmailOpen] = useState(false)

    const token = localStorage.getItem("token")

    const mutationAnother: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/verifyanother", { token })
        },
        onSuccess: ({ data }) => {
            console.log(data)
        },
    })

    useEffect(() => {
        document.title = "Account | RapidTyper"
        if (!localStorage.getItem("token")) {
            return navigate("/account/login", { replace: true })
        }
    }, [navigate])

    return (
        <main>
            <div className="__account__container">
                <div className="__accheader g_split-2">
                    <h2 className="csac">Your account</h2>
                    {!verified && (
                        <div style={{ textAlign: "right" }}>
                            <p>
                                <span>Your email address has not been verified. Please check your email.</span>
                                <span>&nbsp;</span>{" "}
                                <button className="inlinebutton" onClick={() => mutationAnother.mutate()}>
                                    Resend email
                                </button>
                            </p>
                        </div>
                    )}
                    <Logout />
                </div>
                {loggedin ? (
                    <>
                        <div className="__contentbody__main">
                            <div className="__info_singlecontainer">
                                <h3 className="cshandler">Your username: </h3>
                                <p className="cshandler">
                                    <span>{username}</span>
                                    <button className="textonlybtn" onClick={() => setChangeNameOpen(!changeNameOpen)}>Change</button>
                                    <button className="textonlybtn">
                                        <Link tabIndex={-1} to={"/user/" + username}>View your profile</Link>
                                    </button>
                                </p>
                                {changeNameOpen ? <Overlay /> : ""}
                                {changeNameOpen && 
                                <div className="share__modal selector_container">
                                    <h1 className="modalCallerHeader kpbb">Change username</h1>
                                    <div className="close_container">
                                        <button className="close-modal-button" onClick={() => setChangeNameOpen(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                                <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <ChangeName/>
                                </div>
                                }
                                <br />
                                <h3 className="cshandler">Your email: </h3>
                                <p className="cshandler">
                                    <span>{email}</span>
                                    <button className="textonlybtn" onClick={() => setChangeEmailOpen(!changeEmailOpen)}>Change</button>
                                </p>
                                {changeEmailOpen ? <Overlay /> : ""}
                                {changeEmailOpen && 
                                <div className="share__modal selector_container">
                                    <h1 className="modalCallerHeader kpbb">Change email</h1>
                                    <div className="close_container">
                                        <button className="close-modal-button" onClick={() => setChangeEmailOpen(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                                <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <ChangeEmail />
                                </div>
                                }
                                <br/>
                                <ChangeCountry />
                                <br />
                                <ChangePassword />
                            </div>
                        </div>

                        
                        <div className="dangerzone">
                            <h2 className="dzh">Danger zone</h2>
                            <Delete />
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Error 403 - You need to sign in!</h1>
                    </>
                )}
            </div>
        </main>
    )
}
