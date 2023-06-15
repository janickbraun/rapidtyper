import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { useEffectOnce } from "react-use"

export default function useUnlockSkin() {
    const [unlocked, setUnlocked] = useState(false)
    const [func, setFunk] = useState<any>()
    const token = window.localStorage.getItem("token")

    const mutation: any = useMutation({
        mutationFn: async (skin: string) => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/unlockskin", { skin, token })
        },
        onSuccess: ({ data }) => {
            console.log(data.new)
            console.log(data.skin)
            setUnlocked(true)
        },
    })

    const run = (skin: string) => {
        if (!token || !skin) return
        mutation.mutate(skin)
        console.log(skin, token)
    }

    useEffectOnce(() => {
        setFunk(run)
    })

    return [run]
}
