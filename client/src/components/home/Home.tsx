import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import React from "react"

export default function Home() {
    const { data, error, isError, isLoading, isSuccess } = useQuery({
        queryKey: ["mydata"],
        queryFn: async () => {
            const { data } = await axios.get("myurl")
        },
    })
    return (
        <div>
            <h2>Home</h2>
        </div>
    )
}
