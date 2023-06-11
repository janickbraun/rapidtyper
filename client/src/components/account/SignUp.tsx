import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const initialValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
}

export default function SignUp() {
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

    return (
        <div>
            <h3>Sign up</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Username" value={values.username} onChange={handleInputChange} name="username" />
                <input type="email" placeholder="Email" value={values.email} onChange={handleInputChange} name="email" />
                <input type="password" placeholder="Password" value={values.password} onChange={handleInputChange} name="password" />
                <input type="password" placeholder="Confirm Password" value={values.passwordConfirm} onChange={handleInputChange} name="passwordConfirm" />
                <input type="submit" value="Sign up" onClick={() => mutation.mutate()} />
                {mutation.isError && <div>An error occurred: {mutation.error.response.data}</div>}
                {mutation.isSuccess && <div>Successfully signed up</div>}
            </form>
        </div>
    )
}
