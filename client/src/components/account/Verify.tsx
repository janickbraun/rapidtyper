import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffectOnce } from "react-use"

export default function Reset() {
    let [searchParams] = useSearchParams()
    let navigate = useNavigate()
    const [username, setUsername] = useState("")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/verify", { username: searchParams.get("user"), code: searchParams.get("code") })
        },
    })

    useEffectOnce(() => {
        let code = searchParams.get("code")
        let user = searchParams.get("user")

        if (!user || !code) return navigate("/")
        setUsername(user)

        mutation.mutate()
    })

    return (
        <main>
            {mutation.isError && <div className="cserror">{mutation.error.message}</div>}
            {mutation.isSuccess && (
                <div className="cssuccess" style={{ maxWidth: "max-content", marginLeft: "2rem" }}>
                    Your email is now verified! Thank you for your efforts. We are going to reward you with a new skin. Check it out:
                    <Link to={"/user/" + username}>
                        <button>{username}'s profile</button>
                    </Link>
                </div>
            )}
        </main>
    )
}
