import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function ChangePassword() {
    const [oldPassword, setoldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const token = localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/changepassword", { oldPassword, newPassword, confirmPassword, token })
        },
    })

    const handleChange = () => {
        mutation.mutate()
    }
    return (
        <div>
            <h3 className="cshandler">Change password: </h3>
            <input type="password" className="rt__default_input mwdt" style={{display: "block"}} placeholder="Old password" onChange={(e) => setoldPassword(e.target.value)} />
            <input type="password" className="rt__default_input mwdt" style={{display: "block"}} placeholder="New password" autoComplete="new-password" onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" className="rt__default_input mwdt" style={{display: "block"}} placeholder="Confirm new password" autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} />
            <button onClick={handleChange}>Change password</button>
            {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div>Successfully changed password</div>}
        </div>
    )
}
