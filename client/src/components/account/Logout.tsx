import React from "react"

export default function Logout() {
    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/?logout"
    }
    return (
        <div>
            <h3>Logout</h3>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
