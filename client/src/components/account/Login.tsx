import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Link } from "react-router-dom"

const initialValues = {
    email: "",
    password: "",
}

export default function SignUp() {
    const queryClient = useQueryClient()

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/login", values)
        },
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["login"] })
            localStorage.setItem("token", data.token)
            window.location.href = "/?login=true"
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

    return (
        <>
        <div className="footerfix"></div>
        <div className="auth_form tsx_2">
            <div className="h4_gr hdr">
                <h2 className="lgh">Login</h2>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="authform">
                <div className="_input_container">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="rt__default_input mwdt" placeholder="Enter your email" value={values.email} onChange={handleInputChange} name="email" />
                </div>
                <div className="_input_container">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="rt__default_input mwdt" placeholder="Enter your password" value={values.password} onChange={handleInputChange} name="password" />
                </div>
                <div className="authbtncontainer">
                    <button type="submit" className="authwidth" onClick={() => mutation.mutate()}>Login</button>
                </div>
                {mutation.isError && <div className="cserror">An error occurred: {mutation.error.response.data}</div>}
                {mutation.isSuccess && <div className="cssuccess">Successfully logged in</div>}
            </form>
            <div className="hint__container">
                <p className="fgp"><Link to={"/reset"}>Forgot password?</Link></p>
                <p className="sgup"><Link to={"/account/signup"}>Signup</Link></p>
            </div>
        </div>
        </>
    )
}
