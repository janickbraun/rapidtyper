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
            {mutation.error && (
                <>
                    <p style={{ color: "#ff3333", fontWeight: 500 }}>Could not load Leaderboard</p>&nbsp;&nbsp;<p style={{ fontWeight: 400 }}>Error: {mutation.error.message}</p>
                </>
            )}

            <div className="innerLDB">
                <div className="g_split-2">
                    <h2 className="trcaller">Leaderboard</h2>
                    <button className="sortBtn" onClick={handleSortChange}>
                        <div className="btn_icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M240.3 177.4c9.75-8.977 10.34-24.18 1.344-33.94L145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4zM432.3 334.6c-9.779-9.07-24.97-8.414-33.9 1.344L344 394.9V56.02C344 42.76 333.3 32 320 32s-24 10.76-24 24.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1C442.6 358.8 442 343.6 432.3 334.6z" />
                            </svg>
                        </div>
                        <span className="spcbtn_contenttxt">{leaderboardType}</span>
                    </button>
                </div>
                <table>
                    {mutation.isSuccess ? (
                        <>
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
                                            <td className="userTd">
                                                <img className="user_origincounty" src={"https://flagicons.lipis.dev/flags/1x1/" + val.country + ".svg"} loading="lazy" draggable="false" alt="" />
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
                        </>
                    ) : (
                        <div>Loading...</div>
                    )}
                </table>
            </div>
        </div>
    )
}
