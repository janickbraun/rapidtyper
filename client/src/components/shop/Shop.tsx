import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function Shop() {
    const [skin, setSkin] = useState("")
    const [name, setName] = useState("")
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

    const handleClick = (skin: string) => {
        setSkin("dog-poop")
        setName("Pooping dog")
        setConfirmOpen(true)
    }

    const handleClose = () => {
        setSkin("")
        setConfirmOpen(false)
    }

    return (
        <main>
            <h1>Shop</h1>
            <div onClick={() => handleClick("dog-poop")}>
                <img src="/img/skins/dog-poop.png" alt="Pooping dog skin" />
                <div>Pooping dog</div>
                <div>2 US $</div>
            </div>

            <br />
            <br />
            <br />

            {confirmOpen && (
                <div>
                    Do your really want to buy "{name}" for 2 US $?
                    <button onClick={handlePurchase}>Confirm</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            )}
            {mutation.isError && <div>{mutation.error?.response?.data}</div>}
        </main>
    )
}
