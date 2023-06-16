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
        <>
        <div className="footerfix"></div>
        <div className="auth_form tsx_2">
            <div className="h4_gr hdr">
                <h2 className="lgh">Signup</h2>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="_input_container">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" className="rt__default_input mwdt" placeholder="Choose a username" value={values.username} onChange={handleInputChange} name="username" />
                </div>
                <div className="_input_container">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="rt__default_input mwdt" placeholder="Enter your email" value={values.email} onChange={handleInputChange} name="email" />
                </div>
                <div className="_input_container">
                    <label htmlFor="password">Country</label>
                    <Select options={options} placeholder="Select your country" value={country} onChange={changeHandler} />
                </div>
                <div className="_input_container">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="rt__default_input mwdt" placeholder="Password" value={values.password} onChange={handleInputChange} name="Enter your password" />
                </div>
                <div className="_input_container">
                    <label htmlFor="confirmpwd">Confirm password</label>
                    <input type="password" id="confirmpwd" className="rt__default_input mwdt" placeholder="Confirm your Password" value={values.passwordConfirm} onChange={handleInputChange} name="passwordConfirm" />
                </div>
                <div className="authbtncontainer">
                    <button type="submit" className="authwidth" onClick={() => mutation.mutate()}>Sign up</button>
                </div>
                {mutation.isError && <div className="cserror">An error occurred: {mutation.error.response.data}</div>}
                {mutation.isSuccess && <div className="cssuccess">Successfully signed up</div>}
            </form>
        </div>
        </>
    )
}
