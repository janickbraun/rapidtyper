import React, { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Stats from "./Stats"

export default function Profile() {
    const { username } = useParams()

    useEffect(() => {
        document.title = username + " | RapidTyper"
    }, [username])

    return (
        <main>
            <h1>Profile</h1>
            <h2>{username}</h2>
            <Stats username={username} />
            <br />
            <br />
            <button>
                <Link to="/">Back</Link>
            </button>
        </main>
    )
}
