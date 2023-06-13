import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Stats from "./Stats"
import useAuth from "../../hooks/useAuth"
import Overlay from "../modal/Overlay"

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
            <div className="search__container">
                <input
                    className="rt__default_input"
                    type="text"
                    placeholder="Search profiles"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch()
                    }}
                />
                {" "}
                <button onClick={handleSearch}>
                    <span>Search</span>
                    <div className="btn_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" style={{height: 16,paddingBottom: 2, marginLeft: 2}} viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
                    </div>
                </button>
            </div>
            <div className="user_default_container">
                <Stats username={username} dta />
            </div>
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
