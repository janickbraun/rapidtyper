import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

export default function Home() {
    const [loggedin] = useAuth()
    let navigate = useNavigate()

    useEffect(() => {
        document.title = "RapidTyper - Improve your typing skills, practice against yourself or play against others"
    }, [])

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
        //is a lobby free
        //otherwise create one
    }

    return (
        <main>
            <h2>Home</h2>
            <Link className="test" to="/singleplayer">
                Singleplayer
            </Link>
            <br />
            <br />

            <Link className="test" to="/account">
                Account
            </Link>
            <br />
            <br />

            {loggedin ? (
                <>
                    <button onClick={handleMultiplayer}>Multiplayer</button>
                    {mutationMultiplayer.isError && <div>{mutationMultiplayer.error.message}</div>}
                </>
            ) : (
                <div>For playing online you need to login</div>
            )}

            {
                // Start game section | Singleplayer & Multiplayer
                // //
                // Leaderboard
                // //
                // About / Learn
            }
        </main>
    )
}
