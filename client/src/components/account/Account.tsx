import React, { useEffect } from "react"
import SignUp from "./SignUp"
import Login from "./Login"
import Logout from "./Logout"
import Delete from "./Delete"
import useAuth from "../../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import ChangeName from "./ChangeName"
import ChangeCountry from "./ChangeCountry"

export default function Account() {
    const [loggedin, username] = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Account | RapidTyper"
        if (!localStorage.getItem("token")) {
            return navigate("/account/login", { replace: true })
        }
    }, [navigate])

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
