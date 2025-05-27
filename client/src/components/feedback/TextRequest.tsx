import React, { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"

export default function TextRequest() {
    const [loggedin] = useAuth()
    const [text, setText] = useState("")
    const [author, setAuthor] = useState("")
    const [proofUrl, setProofUrl] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        document.title = "Text Request | RapidTyper"
    }, [])

    const token = localStorage.getItem("token")

    const { mutate, isSuccess } = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/textrequest", { token, text, author, url: proofUrl })
        },
        onSuccess: () => {
            setText("")
            setAuthor("")
            setProofUrl("")
            setError("")
        },
        onError: (e: any) => {
            console.log(e)
            setError(e?.response?.data)
        },
    })

    const handleRequest = () => {
        mutate()
    }

    return (
        <main>
            <h1 style={{ textAlign: "center", marginTop: "1em" }}>Text Request</h1>
            <p style={{ textAlign: "center" }}>
                If you would like to add text to type, please submit the following.<br />Please keep the text short and readable. Also, please send proof of where the text is coming from.
            </p>
            <div className="cos_center">
                <input type="text" className="rt__default_input mwdt" placeholder="Author" onChange={(e) => setAuthor(e.target.value)} value={author} />
            </div>
            <div className="cos_center">
                <input type="text" className="rt__default_input mwdt" placeholder="URL for proof" onChange={(e) => setProofUrl(e.target.value)} value={proofUrl} />
            </div>
            <div className="cos_center">
                <textarea className="rt__default_input textarea" onChange={(e) => setText(e.target.value)} value={text} placeholder="Text" />
            </div>
            <br />
            {loggedin ? (
                <div style={{ textAlign: "center" }}>
                    <button className="__feedbackbtn" onClick={handleRequest}>
                        Send
                        <svg xmlns="http://www.w3.org/2000/svg" className="btbsvg" viewBox="0 0 512 512">
                            <path d="M511.1 255.1c0 12.8-7.625 24.38-19.41 29.41L44.6 477.4c-4.062 1.75-8.344 2.594-12.59 2.594c-8.625 0-17.09-3.5-23.28-10.05c-9.219-9.766-11.34-24.25-5.344-36.27l73.66-147.3l242.1-30.37L77.03 225.6l-73.66-147.3C-2.623 66.3-.4982 51.81 8.72 42.05c9.25-9.766 23.56-12.75 35.87-7.453L492.6 226.6C504.4 231.6 511.1 243.2 511.1 255.1z" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div style={{ textAlign: "center" }}>
                    In order submit a text request you need to{" "}
                    <Link className="_userlink" to="/account/login">
                        log in
                    </Link>
                    .
                </div>
            )}
            {error !== "" && <div>{error}</div>}
            {isSuccess && (
                <div>
                    Thank you for your text request! The RapidTyper-Team is going to approve it in the next few buisiness days. We will send you an email, if your text request got accepted or not.
                </div>
            )}
        </main>
    )
}
