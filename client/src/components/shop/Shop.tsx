import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useEffectOnce } from "react-use"

export default function Shop() {
    const [skin, setSkin] = useState("")
    const [skins, setSkins] = useState([])
    const [name, setName] = useState("")
    const [filename, setFilename] = useState("")
    const [price, setPrice] = useState<number>(0)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const token = localStorage.getItem("token")
    const mutationBuy: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/buy", { token, skin })
        },
        onSuccess: ({ data }) => {
            window.location.href = data.link
        },
    })

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/getShop", { token })
        },
        onSuccess: ({ data }) => {
            setSkins(data.skins)
        },
    })

    const handlePurchase = () => {
        mutationBuy.mutate()
    }

    useEffectOnce(() => {
        mutation.mutate()
    })

    const handleClick = (skin: string, cost: number, name: string, filename: string) => {
        setSkin(skin)
        setName(name)
        setPrice(cost)
        setFilename(filename)
        setConfirmOpen(true)
    }

    const handleClose = () => {
        setSkin("")
        setPrice(0)
        setFilename("")
        setConfirmOpen(false)
    }

    return (
        <main>
            <h1>Shop</h1>

            {skins.map((item: any) => (
                <div onClick={() => handleClick(item.filename, item.price, item.name, item.filename)} key={item.name}>
                    <img src={"/img/skins/" + item.filename + ".png"} alt={item.name} width={100} height={100} />
                    <div>{item.name}</div>
                    <i>{item.description}</i>
                    <div>{item.price} US $</div>
                    <br />
                </div>
            ))}
            <br />
            <br />

            {confirmOpen && (
                <div>
                    <img src={"/img/skins/" + filename + ".png"} alt={name} />
                    Do your really want to buy "{name}" for {price} US $?
                    <button onClick={handlePurchase}>Confirm</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            )}
            {mutationBuy.isError && <div>{mutationBuy.error?.response?.data}</div>}
        </main>
    )
}
