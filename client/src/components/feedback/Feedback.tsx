import React, { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"

export default function Feedback() {
    const [loggedin, username] = useAuth()
    const [feedback, setFeedback] = useState("")
    const [newSkin, setNewSkin] = useState(false)

    useEffect(() => {
        document.title = "Feedback | RapidTyper"
    }, [])

    const token = localStorage.getItem("token")

    const { mutate, isSuccess } = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/feedback", { token, feedback })
        },
        onSuccess: ({ data }) => {
            setFeedback("")
            setNewSkin(data.skin)
        },
        onError: (e) => {
            console.log(e)
        },
    })

    const handleFeedback = () => {
        mutate()
    }

    return (
        <main>
            <h1 style={{ textAlign: "center", marginTop: "5rem" }}>Feedback</h1>
            <p style={{ textAlign: "center" }}>
                Tell us what you like or dislike about RapidTyper.
                <br /> Or
                <Link className="_userlink" to="/text-request">
                    Request a typing text
                </Link>
            </p>
            <div className="cos_center">
                <textarea className="rt__default_input textarea" onChange={(e) => setFeedback(e.target.value)} value={feedback} placeholder="Message" />
            </div>
            <br />
            {loggedin ? (
                <div style={{ textAlign: "center" }}>
                    <button className="__feedbackbtn" onClick={handleFeedback}>
                        Send
                        <svg xmlns="http://www.w3.org/2000/svg" className="btbsvg" viewBox="0 0 512 512">
                            <path d="M511.1 255.1c0 12.8-7.625 24.38-19.41 29.41L44.6 477.4c-4.062 1.75-8.344 2.594-12.59 2.594c-8.625 0-17.09-3.5-23.28-10.05c-9.219-9.766-11.34-24.25-5.344-36.27l73.66-147.3l242.1-30.37L77.03 225.6l-73.66-147.3C-2.623 66.3-.4982 51.81 8.72 42.05c9.25-9.766 23.56-12.75 35.87-7.453L492.6 226.6C504.4 231.6 511.1 243.2 511.1 255.1z" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div style={{ textAlign: "center" }}>
                    In order to leave feedback please{" "}
                    <Link className="_userlink" to="/account/login">
                        log in
                    </Link>
                    .
                </div>
            )}
            {isSuccess && <div>Thank you four your feedback!</div>}
            {newSkin && (
                <div>
                    We are rewarding you with a brand new skin! Check it out <Link to={"/user/" + username}>{username}'s profile</Link>
                </div>
            )}
        </main>
    )
}
