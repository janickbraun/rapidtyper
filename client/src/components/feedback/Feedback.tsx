import React, { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"

//handleSkin("bird")}

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
            <h1>Feedback</h1>
            <p>Tell us what you like or dislike about RapidTyper.</p>
            <textarea onChange={(e) => setFeedback(e.target.value)} value={feedback} placeholder="Message" />
            <br />
            {loggedin ? (
                <button onClick={handleFeedback}>Send</button>
            ) : (
                <div>
                    In order to leave feedback please <Link to="/account/login">login</Link>
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
