import React from "react"
import { Link } from "react-router-dom"

export default function Header({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <h1>
                <Link to="/">Header</Link>{" "}
            </h1>

            {children}
        </div>
    )
}
