import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Stats from "./Stats"
import useAuth from "../../hooks/useAuth"

export default function Profile() {
    const { username } = useParams()
    const [search, setSearch] = useState("")
    const [loggedin, myusername] = useAuth()

    useEffect(() => {
        document.title = username + " | RapidTyper"
    }, [username])

    const handleSearch = () => {
        if (search === "") return
        window.location.href = "/user/" + search
    }

    return (
        <main>
            <h1>Profile</h1>
            <input
                type="text"
                placeholder="Search profiles"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch()
                }}
            />{" "}
            <button onClick={handleSearch}>Search</button>
            <h2>{username}</h2>
            <Stats username={username} />
            <br />
            {username !== myusername && loggedin && (
                <Link to={"/user/" + myusername} reloadDocument={true}>
                    <button>Back to {myusername}</button>
                </Link>
            )}
            <br />
            <Link to="/">
                <button>Back</button>
            </Link>
        </main>
    )
}
