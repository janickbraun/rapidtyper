import React, { useState } from "react"
import { useEffectOnce } from "react-use"

export default function AddSkin() {
    const [name, setName] = useState("")
    const [filename, setFilename] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")

    //validtaon of user with id

    const handleSubmit = () => {
        console.log("add")
    }
    return (
        <div>
            <h3>Add skin</h3>

            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Filename" onChange={(e) => setFilename(e.target.value)} />
            <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
            <button onClick={handleSubmit}>Add skin</button>
        </div>
    )
}
