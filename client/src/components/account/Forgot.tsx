import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function Forgot() {
    const [email, setEmail] = useState("")
    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/forgot", { email })
        },
    })

    return (
        <main>
            <h1>Forgot Password</h1>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <button onClick={() => mutation.mutate()}>Submit</button>
            {mutation.isError && <div>{mutation.error?.response?.data}</div>}
            {mutation.isSuccess && <div>We sent you an email. Please check your inbox to reset you password.</div>}
        </main>
    )
}
