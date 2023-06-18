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
            window.location.href = "/?delete=true"
        },
    })

    return (
        <div>
            <h3>Delete</h3>
            
            <div className="_input_container">
                <label htmlFor="irrev">Enter 'IRREVERSIBLE' to delete your account</label>
                <input type="text" placeholder="Enter 'IRREVERSIBLE'" className="rt__default_input mwdt" id="irrev" onChange={(e) => setConfirmationText(e.target.value)} />
            </div>
            <button onClick={() => mutation.mutate()}>Delete</button>
            {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div>Successfully deleted account</div>}
        </div>
    )
}
