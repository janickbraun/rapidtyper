import React, { useEffect } from "react"
import SignUp from "./SignUp"
import Login from "./Login"
import Logout from "./Logout"
import Delete from "./Delete"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import ChangeName from "./ChangeName"
import ChangeCountry from "./ChangeCountry"

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
                    <ChangeName />
                    <ChangeCountry />
                    <Delete />
                </>
            ) : (
                <>
                    <SignUp />
                    <Login />
                </>
            )}
            <button>
                <Link to="/">Back</Link>
            </button>
        </main>
    )
}
