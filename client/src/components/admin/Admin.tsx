import React from "react"
import AddSkin from "./AddSkin"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useEffectOnce } from "react-use"

export default function Admin() {
    let navigate = useNavigate()
    const token = localStorage.getItem("token")

    const { mutate, isSuccess } = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/admin", { token })
        },
        onError: () => {
            navigate("/")
        },
    })

    useEffectOnce(() => {
        mutate()
    })

    return (
        <main>
            {isSuccess ? (
                <div>
                    <h1>Admin</h1>
                    <AddSkin />
                </div>
            ) : (
                <div>No permission</div>
            )}
        </main>
    )
}
