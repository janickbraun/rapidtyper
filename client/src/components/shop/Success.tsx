import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffectOnce } from "react-use"
import useAuth from "../../hooks/useAuth"

export default function Success() {
    let [searchParams, setSearchParams] = useSearchParams()
    let navigate = useNavigate()

    const token = localStorage.getItem("token")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loggedin, username] = useAuth()

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/success", { paymentId: searchParams.get("paymentId"), payerId: searchParams.get("PayerID"), token })
        },
        onSuccess: ({ data }) => {
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

        if (!paymentId || !token || !payerId) return navigate("/")

        mutation.mutate()
    })

    return (
        <main>
            <h1>Success</h1>
            {mutation.isError && <div>{mutation.error?.response?.data}</div>}
            {mutation.isSuccess && (
                <div>
                    Successfully bought new skin. Check it out:
                    <Link to={"/user/" + username}>
                        <button>{username}'s profile</button>
                    </Link>
                </div>
            )}
        </main>
    )
}
