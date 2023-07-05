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
        <main style={{ marginTop: "8rem" }}>
            <h1 style={{ textAlign: "center" }}>{mutation.isSuccess ? "Payment successful" : "Awaiting payment..."}</h1>
            <div className="cfl">
                <div className={mutation.isSuccess ? "" : "loader"}>{mutation.isSuccess ? "" : "loading..."}</div>
            </div>
            {mutation.isError && (
                <div className="cserror" style={{ textAlign: "center", width: "100%", maxWidth: "100%", marginTop: ".6rem" }}>
                    {mutation.error?.response?.data}
                </div>
            )}
            {mutation.isSuccess && (
                <div className="centerboughtitem">
                    <img src={"/img/skins/" + filename + ".png"} alt={name} className="boughtimg" />
                    <h2>Thank you for your purchase!</h2>
                    <p className="successtext">
                        Successfully bought <strong>"{name}"</strong> for <strong>${price}</strong>. Check it out:
                        <Link to={"/user/" + username} className="_userlink">
                            {username}'s profile
                        </Link>
                    </p>
                    <p>We sent you a confirmation email in form of an invoice. Please check your inbox.</p>
                </div>
            )}
        </main>
    )
}
