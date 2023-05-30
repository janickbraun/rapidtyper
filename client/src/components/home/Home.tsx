import React from "react"
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <main>
            <h2>Home</h2>
            <Link className="test" to="/account">
                Account
            </Link>
        </main>
    )
}
