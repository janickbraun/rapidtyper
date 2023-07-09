import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function ChangeEmail() {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const token = localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/changeemail", { email, token, password })
        },
        onSuccess: () => {
            setEmail("")
            setPassword("")
        },
    })

    return (
        <div>
            <h3>Change email</h3>
            <div className="__nbflex">
                <div className="_input_container">
                    <input type="email" placeholder="Enter new email" autoComplete="off" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <input type="password" placeholder="Confirm with password" autoComplete="off" onChange={(e) => setPassword(e.target.value)} value={password} />
                </div>
                <button onClick={() => mutation.mutate()}>Change email</button>
            </div>
            {mutation.isError && <div className="cserror">An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div className="cssuccess">Successfully changed email. We sent you an verification email. Please check your inbox.</div>}
        </div>
    )
}
