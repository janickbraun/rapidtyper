import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect, useRef } from "react"

export default function useAuth() {
    const [loggedin, setLoggedin] = useState(false)

    const token = localStorage.getItem("token")

    const hasFired = useRef(false)

    const { mutate, isIdle } = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/isloggedin", { token })
        },
        onSuccess: ({ data }) => {
            setLoggedin(data.loggedin)
        },
    })

    useEffect(() => {
        if (isIdle && !hasFired.current) {
            hasFired.current = true
            mutate()
        }
    }, [token, mutate, isIdle])

    return [loggedin]
}
