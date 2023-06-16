import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

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
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" value={values.email} onChange={handleInputChange} name="email" />
                <input type="password" placeholder="Password" value={values.password} onChange={handleInputChange} name="password" />
                <input type="submit" value="Login" onClick={() => mutation.mutate()} />
                {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
                {mutation.isSuccess && <div>Successfully logged in</div>}
            </form>
        </div>
        </>
    )
}
