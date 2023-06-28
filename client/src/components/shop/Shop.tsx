import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useEffectOnce } from "react-use"
import Overlay from "../modal/Overlay"

export default function Shop() {
    const [skin, setSkin] = useState("")
    const [skins, setSkins] = useState([])
    const [name, setName] = useState("")
    const [loading, setLoading] = useState("")
    const [price, setPrice] = useState<number>(0)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const token = localStorage.getItem("token")
    const mutationBuy: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/buy", { token, skin })
        },
        onSuccess: ({ data }) => {
            window.location.href = data.link
        },
    })

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/getShop", { token })
        },
        onSuccess: ({ data }) => {
            setSkins(data.skins)
        },
    })

    const handlePurchase = () => {
        mutationBuy.mutate()
        setLoading("loading")
    }

    useEffectOnce(() => {
        mutation.mutate()
    })

    const handleClick = (skin: string, cost: number, name: string, filename: string) => {
        setSkin(skin)
        setName(name)
        setPrice(cost)
        setConfirmOpen(true)
    }

    const handleClose = () => {
        setSkin("")
        setPrice(0)
        setConfirmOpen(false)
    }

    const glowAssist: any = {
        backgroundImage: `url(/img/skins/${skin}.png)`,
    }

    return (
        <main>
            <h1>Shop</h1>

            <div className="contentflex">
            <div className="shopitemcontai">
            {skins.map((item: any) => (
                <div className="shopsingleitem" onClick={() => handleClick(item.filename, item.price, item.name, item.filename)} key={item.name}>
                    <div className="imagecontainer">
                        <div className="glowparent">
                            <img src={"/img/skins/" + item.filename + ".png"} className="glowimg" alt={item.name} width={100} height={100} />
                        </div>
                    </div>
                    <div className="textcontainer">
                        <p className="skin_namecaller">
                            {item.name}
                        </p>
                    </div>
                    <div className="itemdescriptioncontainer">
                        <p className="itemdsc">{item.description}</p>
                    </div>
                    <div className="itemprice">${item.price}</div>
                    <br />
                </div>
            ))}
            </div>
            </div>
            <br />
            <br />
            {confirmOpen ? <Overlay /> : ""}
            {confirmOpen && (
                <div className="selector_container">
                    <h1 className="modalCallerHeader">Confirm purchase</h1>
                    <div className="close_container">
                        <button className="close-modal-button" onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="contentdisplay">
                        <div className="mask_contentparent" style={glowAssist}>
                            <img loading="eager" src={"/img/skins/" + skin + ".png"} alt={name} className="shopimagedisplay" draggable="false" />
                        </div>
                        <p className="conftext">Are you sure you want to buy "{name}" for ${price}?</p>
                    </div>
                    <div className="copconfirmset">
                        <button className={loading} onClick={handlePurchase}>
                            Confirm
                        </button>
                        {mutationBuy.isError && <div className="cserror">{mutationBuy.error?.response?.data}</div>}
                    </div>
                </div>
            )}
        </main>
    )
}
