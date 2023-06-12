import React, { useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import Select from "react-select"
import countryList from "react-select-country-list"

const initialValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    country: "",
}

export default function SignUp() {
    const [country, setCountry] = useState("")
    const options: any = useMemo(() => countryList().getData(), [])

    const queryClient = useQueryClient()

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/signup", values)
        },
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["signup"] })
            localStorage.setItem("token", data.token)
            window.location.href = "/?signup=true"
        },
    })

    const [values, setValues] = useState(initialValues)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setValues({
            ...values,
            [name]: value,
        })
    }

    const changeHandler = (e: any) => {
        setCountry(e)
        setValues({
            ...values,
            country: e.value,
        })
    }

    return (
        <div>
            <h3>Sign up</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Username" value={values.username} onChange={handleInputChange} name="username" />
                <input type="email" placeholder="Email" value={values.email} onChange={handleInputChange} name="email" />
                <Select options={options} value={country} onChange={changeHandler} />
                <input type="password" placeholder="Password" value={values.password} onChange={handleInputChange} name="password" />
                <input type="password" placeholder="Confirm Password" value={values.passwordConfirm} onChange={handleInputChange} name="passwordConfirm" />
                <input type="submit" value="Sign up" onClick={() => mutation.mutate()} />
                {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
                {mutation.isSuccess && <div>Successfully signed up</div>}
            </form>
        </div>
    )
}
