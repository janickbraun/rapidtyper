import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Leaderboard from "./Leaderboard"

export default function Home() {
    const [loggedin, username] = useAuth()
    let navigate = useNavigate()

    useEffect(() => {
        document.title = "RapidTyper"
        if (localStorage.getItem("back") === "true") {
            localStorage.removeItem("back")
            window.location.reload()
        }
    }, [navigate])

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
            <h1>Home</h1>
            {loggedin && (
                <>
                    <Link tabIndex={-1} to={"/user/" + username}>
                        <button>Profile</button>
                    </Link>{" "}
                </>
            )}
            <Link tabIndex={-1} to="/account">
                <button>Account</button>
            </Link>
            <br />
            <br />
            <Link tabIndex={-1} to="/singleplayer">
                <button>Singleplayer</button>
            </Link>{" "}
            {loggedin ? (
                <>
                    <button onClick={handleMultiplayer}>Multiplayer</button>
                    {mutationMultiplayer.isError && <div>{mutationMultiplayer.error.message}</div>}
                </>
            ) : (
                <div>For playing online you need to login</div>
            )}
            <Leaderboard />
        </main>
    )
}
