import React from "react"
import { Link } from "react-router-dom"

export default function Cancel() {
    return (
        <main style={{marginTop: "8rem"}}>
            <h1 style={{textAlign: "center"}}>Your order got canceled successfully</h1>
            <div style={{textAlign: "center", marginTop: "2rem"}}>
                <Link to={"/"}>
                    <button tabIndex={-1}>Home</button>
                </Link>
            </div>
        </main>
    )
}
