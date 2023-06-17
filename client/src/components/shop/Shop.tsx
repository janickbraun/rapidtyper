import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function Shop() {
    const [skin, setSkin] = useState("")
    const [confirmOpen, setConfirmOpen] = useState(false)

    const token = localStorage.getItem("token")
    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/buy", { token, skin })
        },
        onSuccess: ({ data }) => {
            window.location.href = data.link
        },
    })

    const handlePurchase = () => {
        mutation.mutate()
    }

    const handleClick = () => {
        setSkin("dog-poop")
        setConfirmOpen(true)
    }
    return (
        <main>
            <h1>Shop</h1>
            <button onClick={handleClick}>Shit dog</button>
            {confirmOpen && (
                <div>
                    Do your really want to buy pooping dog for 2 US $?
                    <button onClick={handlePurchase}>Confirm</button>
                    <button onClick={() => setConfirmOpen(false)}>Cancel</button>
                </div>
            )}
            {mutation.isError && <div>{mutation.error?.response?.data}</div>}
        </main>
    )
}
