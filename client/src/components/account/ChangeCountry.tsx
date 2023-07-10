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
            <h3 className="cshandler">Change country:</h3>
            <div style={{display: "flex", alignItems: "center", columnGap: "2rem"}}>
            <Select options={options} value={country} onChange={changeHandler} />
            <button onClick={() => mutation.mutate()}>Change</button>
            </div>
            {mutation.isError && <div className="cserror" style={{transform: "translate(0)", margin: 0}}>An error occurred: {mutation.error.response.data}</div>}
            {mutation.isSuccess && <div className="cssuccess" style={{transform: "translate(0)", margin: 0}}>Successfully changed country</div>}
        </div>
    )
}
