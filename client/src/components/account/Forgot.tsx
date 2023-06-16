import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Forgot() {
    const [email, setEmail] = useState("")
    let navigate = useNavigate()
    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/forgot", { email })
        },
        onSuccess: ({ data }) => {
            navigate("/")
        },
    })

    return (
        <main>
            <h1>Forgot Password</h1>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <button onClick={() => mutation.mutate()}>Submit</button>
            {mutation.isError && <div>{mutation.error.message}</div>}
        </main>
    )
}
