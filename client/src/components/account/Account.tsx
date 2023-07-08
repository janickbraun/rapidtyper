import React, { useEffect } from "react"
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

export default function Account() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedin, username, skin, verified, email] = useAuth()
    const navigate = useNavigate()

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
                    <button>
                        <Link to={"/user/" + username}>View your profile</Link>
                    </button>
                    <Logout />
                </div>
                {loggedin ? (
                    <>
                        <div className="__contentbody__main">
                            <div className="__info_singlecontainer">
                                <h2 className="cshandler">Your username: </h2>
                                <p className="cshandler">
                                    <span>{username}</span>
                                </p>
                                <ChangeName />
                                <h3 className="cshandler">Your email: </h3>
                                <p className="cshandler">
                                    <span>{email}</span>
                                </p>
                                <ChangeEmail />
                                <ChangeCountry />
                            </div>
                        </div>

                        <div className="dangerzone">
                            <h2 className="dzh">Danger zone</h2>
                            <ChangePassword />
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
