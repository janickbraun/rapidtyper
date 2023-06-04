import React, { useEffect } from "react"
import SignUp from "./SignUp"
import Login from "./Login"
import Logout from "./Logout"
import Delete from "./Delete"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"

export default function Account() {
    const [loggedin, username] = useAuth()

    useEffect(() => {
        document.title = "Account | RapidTyper"
    }, [])

    return (
        <main>
            <h2>Account</h2>
            {loggedin ? (
                <>
                    <button>
                        <Link to={"/user/" + username}>Profile</Link>
                    </button>

                    <Logout />
                    <Delete />
                </>
            ) : (
                <>
                    <SignUp />
                    <Login />
                </>
            )}
        </main>
    )
}
