import axios from "axios"

export const unlockSkin = (skin: string) => {
    const token = window.localStorage.getItem("token")

    if (!token || !skin) return
    try {
        axios.post(process.env.REACT_APP_BACKEND_URL + "/api/unlockskin", { skin, token })
    } catch (e) {
        console.log(e)
    }
}
