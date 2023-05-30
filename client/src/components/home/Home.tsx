import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

export default function Home() {
    const [loggedin] = useAuth()
    const [raceCode, setRaceCode] = useState("")
    let navigate = useNavigate()

    useEffect(() => {
        document.title = "RapidTyper - Improve your typing skills, practice against yourself or play against others"
    }, [])

    const token = localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/createrace", { token })
        },
        onSuccess: ({ data }) => {
            navigate("/multiplayer/" + data.code)
        },
    })

    const handleCreateRace = () => {
        mutation.mutate()
    }

    const handleJoinRace = () => {
        console.log(raceCode)
        //send request with code
    }

    return (
        <main>
            <h2>Home</h2>
            <Link className="test" to="/account">
                Account
            </Link>
            <br />
            <br />
            {loggedin && (
                <>
                    <button onClick={handleCreateRace}>Create Race</button>
                    {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
                </>
            )}

            <br />
            <br />
            <input type="text" placeholder="Enter Code" maxLength={4} onChange={(e) => setRaceCode(e.target.value)} />
            <button onClick={handleJoinRace}>Join Race</button>
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
