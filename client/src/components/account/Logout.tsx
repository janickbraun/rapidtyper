import React from "react"

export default function Logout() {
    return (
        <div>
            <h3>Logout</h3>
            <button onClick={() => localStorage.removeItem("token")}>Logout</button>
        </div>
    )
}
