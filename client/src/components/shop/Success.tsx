import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffectOnce } from "react-use"
import useAuth from "../../hooks/useAuth"

export default function Success() {
    let [searchParams, setSearchParams] = useSearchParams()
    let navigate = useNavigate()

    const token = localStorage.getItem("token")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedin, username] = useAuth()
    const [name, setName] = useState("")
    const [filename, setFilename] = useState("")
    const [price, setPrice] = useState(0)

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/success", {
                paymentId: searchParams.get("paymentId"),
                payerId: searchParams.get("PayerID"),
                token,
                skin: searchParams.get("skin"),
            })
        },
        onSuccess: ({ data }) => {
            setName(data.name)
            setFilename(data.filename)
            setPrice(data.price)
            setSearchParams()
        },
        onError: () => {
            setSearchParams()
        },
    })

    useEffectOnce(() => {
        let paymentId = searchParams.get("paymentId")
        let token = searchParams.get("token")
        let payerId = searchParams.get("PayerID")
        let skin = searchParams.get("skin")

        if (!paymentId || !token || !payerId || !skin) return navigate("/")

        mutation.mutate()
    })

    return (
        <main>
            <h1>Success</h1>
            {mutation.isError && <div>{mutation.error?.response?.data}</div>}
            {mutation.isSuccess && (
                <div>
                    <img src={"/img/skins/" + filename + ".png"} alt={name} />
                    Successfully bought "{name}" for {price} US $. Check it out:
                    <Link to={"/user/" + username}>
                        <button>{username}'s profile</button>
                    </Link>
                </div>
            )}
        </main>
    )
}
