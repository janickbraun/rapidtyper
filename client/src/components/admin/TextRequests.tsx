import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useEffectOnce } from "react-use"

export default function AddSkin() {
    const [requests, setRequests] = useState<any>([])

    const token = localStorage.getItem("token")

    const { mutate } = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/admin/gettextrequests", { token })
        },
        onSuccess: ({ data }) => {
            setRequests(data.requests)
            console.log(data.requests)
        },
        onError: (e) => {
            console.log(e)
        },
    })

    useEffectOnce(() => {
        mutate()
    })

    return (
        <div>
            <h3>Text Requests</h3>
            {requests.map((item: any, key: number) => (
                <div key={key}>
                    <p>{item.text}</p>
                    <p>{item.author}</p>
                    <a href={process.env.REACT_APP_FRONTEND_URL + "/user/" + item.username} target="_blank" rel="noreferrer">
                        {item.username}
                    </a>
                    <br />
                    <a href={item.url} target="_blank" rel="noreferrer">
                        {item.url}
                    </a>
                    <p>{new Date(item.creationDate).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    )
}
