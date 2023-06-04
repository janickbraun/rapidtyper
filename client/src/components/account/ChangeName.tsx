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
            <input type="text" onChange={(e) => setUsername(e.target.value)} />
            <button onClick={() => mutation.mutate()}>Rename</button>
            {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div>Successfully changed username</div>}
        </div>
    )
}
