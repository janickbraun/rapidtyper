import React from "react"
import { Link } from "react-router-dom"

export default function Cancel() {
    return (
        <main style={{marginTop: "8rem"}}>
            <h1 style={{textAlign: "center"}}>Your order got canceled successfully</h1>
            <div style={{textAlign: "center", marginTop: "2rem"}}>
                <Link to={"/"} tabIndex={-1}>
                    <button className="wws btn">Home</button>
                </Link>
                &nbsp;&nbsp;&nbsp;
                <Link to={"/"} tabIndex={-1}>
                    <button>Continue shopping</button>
                </Link>
            </div>
        </main>
    )
}
