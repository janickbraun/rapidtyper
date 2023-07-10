import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import React, { useState } from "react"
import { useEffectOnce } from "react-use"
import Overlay from "../modal/Overlay"
import { unlockSkin } from "../../helpers/skinHelper"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import CountDown from "./CountDown"

export default function Shop() {
    const [skin, setSkin] = useState("")
    const [skins, setSkins] = useState([])
    const [name, setName] = useState("")
    const [loading, setLoading] = useState("")
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const [seconds, setSeconds] = useState(5000)
    const [price, setPrice] = useState<number>(0)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loggedin] = useAuth()

    const token = localStorage.getItem("token")
    const mutationBuy: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/buy", { token, skin })
        },
        onSuccess: ({ data }) => {
            window.location.href = data.link
        },
        onError: (err: any) => {
            setLoading("")
            setError(err?.response?.data)
        },
    })

    const mutation: any = useMutation({
        mutationFn: async () => {
            return await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/shop/getShop", { token })
        },
        onSuccess: ({ data }) => {
            setSkins(data.skins)
            setSeconds(data.seconds)
        },
    })

    const handlePurchase = () => {
        if (skin === "jesus") {
            unlockSkin("jesus")
            setMsg("Succsessfully unlocked Jesus skin. God bless you!")
            return
        }
        mutationBuy.mutate()
        setLoading("loading")
    }

    useEffectOnce(() => {
        document.title = "Shop | RapidTyper"
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
        setError("")
        setPrice(0)
        setLoading("")
        setConfirmOpen(false)
    }

    const glowAssist: any = {
        backgroundImage: `url(/img/skins/${skin}.png)`,
    }

    return (
        <main>
            <div className="contentflex">
                <h1 className="shopheader">Shop</h1>
                <p>
                    Shop updates daily. Next update in: {mutation.isLoading ? <div className="skeleton__small"></div> : <CountDown seconds={seconds} />}
                </p>

                {mutation.isLoading ? 
                    <div className="shopitemcontai">
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent">
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <div className="skeleton_shop_img"/>
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller_skeleton">loading</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc_skeleton">loading</p>
                            </div>
                        </div>
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent">
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <div className="skeleton_shop_img"/>
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller_skeleton">loading</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc_skeleton">loading</p>
                            </div>
                        </div>
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent">
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <div className="skeleton_shop_img"/>
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller_skeleton">loading</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc_skeleton">loading</p>
                            </div>
                        </div>
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent">
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <div className="skeleton_shop_img"/>
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller_skeleton">loading</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc_skeleton">loading</p>
                            </div>
                        </div>
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent">
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <div className="skeleton_shop_img"/>
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller_skeleton">loading</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc_skeleton">loading</p>
                            </div>
                        </div>
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent">
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <div className="skeleton_shop_img"/>
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller_skeleton">loading</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc_skeleton">loading</p>
                            </div>
                        </div>
                    </div>
                :
                <div className="shopitemcontai">
                    {skins.map((item: any) => (
                        <div className="shopsingleitem _fitem paypal4 itemContainerParent" onClick={() => handleClick(item.filename, item.price, item.name, item.filename)} key={item.name}>
                            <div className="imagecontainer">
                                <div className="glowparent">
                                    <img src={"/img/skins/" + item.filename + ".png"} className="glowimg" alt={item.name} width={100} height={100} draggable="false" />
                                </div>
                            </div>
                            <div className="textcontainer">
                                <p className="skin_namecaller">{item.name}</p>
                            </div>
                            <div className="itemdescriptioncontainer">
                                <p className="itemdsc">{item.description}</p>
                            </div>
                            <div className="itemprice">${item.price}</div>
                            <br />
                        </div>
                    ))}
                </div>
                }
            </div>
            <br />
            <br />
            {confirmOpen ? <Overlay /> : ""}
            {confirmOpen && (
                <div className="selector_container" style={{ backgroundColor: "#292b2e" }}>
                    <h1 className="modalCallerHeader">{skin === "jesus" ? <>Get Jesus</> : <>Confirm purchase</>}</h1>
                    <div className="close_container">
                        <button className="close-modal-button" onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="csvg" viewBox="0 0 320 512">
                                <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="contentdisplay">
                        <div className={skin === "jesus" ? "mask_contentparent jesus" : "mask_contentparent"} style={glowAssist}>
                            <div className="glowLayerassist"></div>
                            <img loading="eager" src={"/img/skins/" + skin + ".png"} alt={name} className="shopimagedisplay" draggable="false" />
                        </div>
                        <p className="conftext">
                            {skin === "jesus" ? (
                                <>
                                    In order to unlock the Jesus skin, please take a minute:
                                    <br />
                                    <br />
                                    Our Father, Who is in heaven, holy is Your Name; <br />
                                    Your kingdom come, your will be done, <br />
                                    on earth as it is in heaven. <br />
                                    Give us this day our daily bread and forgive us our sins, <br />
                                    as we forgive those who sin against us; <br />
                                    and lead us not into temptation, but deliver us from evil. <br />
                                    For thine is the kingdom, and the power, and the glory, for ever and ever. <br />
                                    Amen.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to buy "{name}" for ${price}?<br />
                                    <span style={{ maxWidth: 450, display: "inline-block" }}>
                                        By completing this purchase, you agree to our{" "}
                                        <Link to={"/terms-of-service"} style={{ padding: 0 }} className="_userlink">
                                            Terms of Service
                                        </Link>{" "}
                                        &{" "}
                                        <a href="//grovider.co/privacy-policy" style={{ padding: 0 }} className="_userlink">
                                            Privacy Policy
                                        </a>
                                        .
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                    <div className="copconfirmset">
                        {loggedin ? (
                            <button className={loading} onClick={handlePurchase}>
                                {skin === "jesus" ? (
                                    <>Amen 🙏</>
                                ) : (
                                    <>
                                        <div className="buttonpaypalsvgcontainer">
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 5 }} height="1.15em" viewBox="0 0 384 512">
                                                <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z" />
                                            </svg>
                                        </div>
                                        <span>Continue with PayPal</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div>
                                <p>
                                    To purchase this skin you need to{" "}
                                    <Link to="/account/login" className="_userlink">
                                        login
                                    </Link>
                                    .
                                </p>
                            </div>
                        )}

                        {error !== "" && <div className="cserror">{error}</div>}
                        {msg !== "" && skin === "jesus" && <>{msg}</>}
                    </div>
                </div>
            )}
        </main>
    )
}
