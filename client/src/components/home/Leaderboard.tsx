import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useEffectOnce } from "react-use"
import "./leaderboard.module.css"
import { Link } from "react-router-dom"

const getAverage = (arr: Array<number>) => {
    const sum = arr.reduce((a: number, b: number) => a + b, 0)
    const avg = sum / arr.length || 0
    return Number(avg.toFixed(2))
}

export default function Leaderboard() {
    const [data, setData] = useState<any>([])
    const [leaderboardType, setLeaderboardType] = useState<"Wpm" | "Total races" | "Races won" | "Accuracy" | "Age" | "Best race">("Wpm")
    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/leaderboard", { type: leaderboardType })
        },
        onSuccess: ({ data }) => {
            setData(data.data)
        },
    })

    useEffectOnce(() => {
        mutation.mutate()
    })

    const handleSortChange = () => {
        const types: Array<"Wpm" | "Total races" | "Races won" | "Accuracy" | "Age" | "Best race"> = ["Wpm", "Total races", "Races won", "Best race", "Accuracy", "Age"]
        for (let i = 0; i < types.length; i++) {
            if (types[i] === leaderboardType) {
                if (i === types.length - 1) {
                    setLeaderboardType(types[0])
                } else {
                    setLeaderboardType(types[i + 1])
                }
                break
            }
        }
        mutation.mutate()
    }

    return (
        <div className="grid_ctpl leaderboard_container f4-only">
            {mutation.isLoading && <>Loading</>}
            {mutation.error && <>Error: {mutation.error.message}</>}
            {mutation.isSuccess && (
                <div className="innerLDB">
                    <div className="g_split-2">
                        <h2>Leaderboard</h2>
                        <button onClick={handleSortChange}>Sort by: {leaderboardType}</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Username</th>
                                <th>Speed</th>
                                <th>Total races</th>
                                <th>Races won</th>
                                <th>Best race</th>
                                <th>Accuracy</th>
                                <th>Racing since</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((val: any, key: number) => {
                                return (
                                    <tr key={key}>
                                        <td>{key + 1 + "."}</td>
                                        <td>
                                            <Link to={"/user/" + val.username}>{val.username}</Link>
                                        </td>
                                        <td>{getAverage(val.wpm)}wpm</td>

                                        <td>{val.racesTotal}</td>
                                        <td>{val.racesWon}</td>
                                        <td>{val.bestRace}wpm</td>
                                        <td>{getAverage(val.accuracy)}%</td>
                                        <td>{new Date(val.creationDate).toLocaleDateString()}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
