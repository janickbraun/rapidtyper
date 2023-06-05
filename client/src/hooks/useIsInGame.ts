import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function useIsInGame() {
    const [isInGame, setIsInGame] = useState(false)

    let location = useLocation()

    useEffect(() => {
        if (location.pathname.startsWith("/multiplayer/")) {
            setIsInGame(true)
        } else {
            setIsInGame(false)
        }
    }, [location])

    return [isInGame]
}
