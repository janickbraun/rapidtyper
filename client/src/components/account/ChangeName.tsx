import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function ChangeName() {
    const [username, setUsername] = useState("")

    const token = localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/changeusername", { username, token })
        },
    })

    return (
        <div>
            <h3>Change username</h3>
            <div className="__nbflex">
            <div className="_input_container">
                <label htmlFor="usernm">Username</label>
                <input type="text" placeholder="Enter a new username" id="usernm" className="rt__default_input mwdt" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <button onClick={() => mutation.mutate()}>Rename</button>
            </div>
            {mutation.isError && <div className="cserror">An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div className="cssuccess">Successfully changed username</div>}
        </div>
    )
}
