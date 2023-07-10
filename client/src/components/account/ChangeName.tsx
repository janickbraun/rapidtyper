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
        <div style={{textAlign: "center"}}>
            <div className="__nbflex" style={{margin: "1.2rem 2rem"}}>
                <div className="_input_container">
                    <input type="text" placeholder="Enter a new username" id="usernm" className="rt__default_input" autoComplete="off" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <button onClick={() => mutation.mutate()}>Rename</button>
            </div>
            {mutation.isError && <div className="cserror" style={{width: "100%", transform: "translateY(-8px)"}}>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div className="cssuccess" style={{width: "100%", transform: "translateY(-8px)"}}>Successfully changed username</div>}
        </div>
    )
}
