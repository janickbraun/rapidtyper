import React from "react"
import { Link } from "react-router-dom"

export default function LearnMore() {

    return (
        <>
            <div className="csi_learnmore">
                <h1 className="ldbcaller">Learn more about RapidTyper</h1>
                <p className="">Discover how RapidTyper works <Link to="/about">here</Link>.</p>
            </div>
        </>
    )
}
