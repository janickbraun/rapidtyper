import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useEffectOnce } from "react-use"

export default function Reset() {
    let [searchParams, setSearchParams] = useSearchParams()
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [code, setCode] = useState("")
    const [username, setUsername] = useState("")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/reset", { username, code, password, passwordConfirm })
        },
    })

    useEffectOnce(() => {
        let code = searchParams.get("code")
        let user = searchParams.get("user")

        if (!user || !code) return
        setUsername(user)
        setCode(code)
        setSearchParams()
    })

    return (
        <main>
            <h1>Reset password</h1>
            <input type="password" placeholder="New password" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm new password" onChange={(e) => setPasswordConfirm(e.target.value)} />
            <button onClick={() => mutation.mutate()}>Reset</button>
            {mutation.isError && <div>{mutation.error.message}</div>}
            {mutation.isSuccess && (
                <div>
                    Password has been successfully reset. You can login now.{" "}
                    <Link to="/account/login">
                        <button>Login</button>
                    </Link>
                </div>
            )}
        </main>
    )
}
