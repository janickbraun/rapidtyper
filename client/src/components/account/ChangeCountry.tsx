import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useMemo, useState } from "react"
import Select from "react-select"
import countryList from "react-select-country-list"

export default function ChangeName() {
    const [country, setCountry] = useState("")
    const options: any = useMemo(() => countryList().getData(), [])

    const token = localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/changecountry", { country, token })
        },
    })

    const changeHandler = (e: any) => {
        setCountry(e)
    }

    return (
        <div>
            <h3>Change country</h3>
            <Select options={options} value={country} onChange={changeHandler} />
            <button onClick={() => mutation.mutate()}>Change</button>
            {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div>Successfully changed country</div>}
        </div>
    )
}
