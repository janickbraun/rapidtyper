import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function Forgot() {
    const [email, setEmail] = useState("")
    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/account/forgot", { email })
        },
    })

    return (
        <>
            <div className="footerfix"></div>
            <div className="auth_form tsx_2">
                <div className="h4_gr hdr">
                    <h2 className="lgh">Forgot Password</h2>
                </div>
                <div className="_input_container">
                    <label htmlFor="resetemail">Email</label>
                    <input type="email" id="resetemail" className="rt__default_input mwdt" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="authbtncontainer">
                    <button type="submit" className="authwidth" onClick={() => mutation.mutate()}>Submit</button>
                </div>
                {mutation.isError && <div className="cserror">{mutation.error?.response?.data}</div>}
                {mutation.isSuccess && <div className="cssuccess">We sent you an email. Please check your inbox to reset you password.</div>}
            </div>
        </>
    )
}
