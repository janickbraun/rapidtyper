import React, { useEffect } from "react"
// import SignUp from "./SignUp"
// import Login from "./Login"
import Logout from "./Logout"
import Delete from "./Delete"
import useAuth from "../../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import ChangeName from "./ChangeName"
import ChangeCountry from "./ChangeCountry"
import ChangePassword from "./ChangePassword"

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
            <div className="__account__container">
                <div className="__accheader g_split-2">
                    <h2 className="csac">Your account</h2>
                    <Logout />
                </div>
                {loggedin ? (
                    <>
                        <div className="__contentbody__main">
                            <div className="__info_singlecontainer">
                                <h2 className="cshandler">Your username: </h2>
                                <p className="cshandler"><span>{username}</span></p>
                                <ChangeName />
                                <ChangeCountry />
                                <Delete />
                            </div>
                            {/*  */}

                            {/*  */}
                            <button>
                                <Link to={"/user/" + username}>View your profile</Link>
                            </button>
                        </div>
                        

                        
                        
                        
                        {/* <ChangePassword /> */}
                        <Delete />
                    </>
                ) : (
                    <>
                        <h1>Error 403 - You need to sign in!</h1>
                    </>
                )}
                {/* {loggedin ? (
                    <>
                        <button>
                            <Link to={"/user/" + username}>Profile</Link>
                        </button>

                        
                        <ChangeName />
                        <ChangeCountry />
                        <ChangePassword />
                        <Delete />
                    </>
                ) : (
                    <>
                        <SignUp />
                        <Login />
                    </>
                )} */}
            </div>
        </main>
    )
}
