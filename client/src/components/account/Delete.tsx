import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function Delete() {
    const [confirmationText, setConfirmationText] = useState("")

    const token = localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/deleteaccount", { confirmationText, token })
        },
        onSuccess: () => {
            localStorage.removeItem("token")
            window.location.href = "/?delete"
        },
    })

    return (
        <div>
            <h3>Delete</h3>
            Enter 'IRREVERSIBLE' to delete your account
            <input type="text" onChange={(e) => setConfirmationText(e.target.value)} />
            <button onClick={() => mutation.mutate()}>Delete</button>
            {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div>Successfully deleted account</div>}
        </div>
    )
}
