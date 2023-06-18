import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useEffectOnce } from "react-use"

export default function Reset() {
    let [searchParams, setSearchParams] = useSearchParams()
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [code, setCode] = useState("")
    const [username, setUsername] = useState("")

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/reset", { username, code, password, passwordConfirm })
        },
    })

    useEffectOnce(() => {
        let code = searchParams.get("code")
        let user = searchParams.get("user")

        if (!user || !code) return
        setUsername(user)
        setCode(code)
        setSearchParams()
    })

    return (
        <>
            <div className="footerfix"></div>
            <div className="auth_form tsx_2">
                <div className="h4_gr hdr">
                    <h2 className="lgh">Reset password</h2>
                </div>
                <div className="_input_container">
                    <label htmlFor="pwd">Password</label>
                    <input type="password" className="rt__default_input mwdt" id="pwd" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="_input_container">
                    <label htmlFor="confirmpwd">Confirm password</label>
                    <input type="password" className="rt__default_input mwdt" id="confirmpwd" placeholder="Confirm new password" onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                <div className="authbtncontainer">
                    <button type="submit" className="authwidth" onClick={() => mutation.mutate()}>Reset</button>
                </div>
                {mutation.isError && <div>{mutation.error.response.data}</div>}
                {mutation.isSuccess && (
                    <div>
                        Password has been successfully reset. You can login now.{" "}
                        <Link to="/account/login">
                            <button>Login</button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
