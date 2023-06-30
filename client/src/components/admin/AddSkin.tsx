import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"

export default function AddSkin() {
    const [name, setName] = useState("")
    const [filename, setFilename] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)

    const token = localStorage.getItem("token")

    const { mutate, isSuccess } = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/admin/addskin", { token, name, filename, description, price })
        },
        onSuccess: ({ data }) => {
            setName("")
            setFilename("")
            setDescription("")
            setPrice(0)
        },
        onError: (e) => {
            console.log(e)
        },
    })

    const handleSubmit = () => {
        mutate()
    }
    return (
        <div>
            <h3>Add skin</h3>

            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
            <input type="text" placeholder="Filename" onChange={(e) => setFilename(e.target.value)} value={filename} />
            <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(Number(e.target.value))} value={price} />
            <button onClick={handleSubmit}>Add skin</button>
            {isSuccess && <div>Successfully added skin</div>}
        </div>
    )
}
