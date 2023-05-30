import React, {useEffect} from "react"
import { Link } from "react-router-dom"

export default function Home() {
    useEffect(() => {
        document.title = 'RapidTyper - Improve your typing skills, practice against yourself or play against others'
    }, [])
    return (
        <main>
            <h2>Home</h2>
            <Link className="test" to="/account">
                Account
            </Link>
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
