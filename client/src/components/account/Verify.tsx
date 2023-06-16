import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffectOnce } from "react-use"

export default function Reset() {
    let [searchParams, setSearchParams] = useSearchParams()
    let navigate = useNavigate()
    const [code, setCode] = useState("")
    const [username, setUsername] = useState("")

    const mutation: any = useMutation({
        mutationFn: async (test: string) => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/verify", { username, code })
        },
    })

    useEffectOnce(() => {
        let code = searchParams.get("code")
        let user = searchParams.get("user")

        if (!user || !code) return navigate("/")
        setUsername(user)
        setCode(code)
        setSearchParams()
        mutation.mutate()
    })

    return (
        <main>
            <h1>Verify your email adress</h1>
            {mutation.isError && <div>{mutation.error.message}</div>}
            {mutation.isSuccess && (
                <div>
                    Your email is now verified! Thank you for your efford. We are rewarding you with a new skin. Check it out:
                    <Link to={"/user/" + username}>
                        <button>{username}'s profile</button>
                    </Link>
                </div>
            )}
        </main>
    )
}