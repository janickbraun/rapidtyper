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
            <h3 className="cshandler redcolorheading">Delete account:</h3>

            <div style={{display: "flex", alignItems: "flex-end", columnGap: "2rem"}}>
            <div className="_input_container">
                <label htmlFor="irrev">Enter 'IRREVERSIBLE' to delete your account</label>
                <input type="text" placeholder="Enter 'IRREVERSIBLE'" style={{marginBottom: 0}} className="rt__default_input mwdt" id="irrev" autoComplete="off" onChange={(e) => setConfirmationText(e.target.value)} />
            </div>
            <button onClick={() => mutation.mutate()}>Delete</button>
            </div>
            {mutation.isError && <div className="cserror" style={{transform: "translate(0)", margin: 0}}>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div className="cssuccess" style={{transform: "translate(0)", margin: 0}}>Successfully changed country</div>}
        </div>
    )
}
