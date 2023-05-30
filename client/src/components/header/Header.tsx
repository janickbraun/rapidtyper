import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import "./header.css"

export default function Header({ children }: { children: React.ReactNode }) {
    const [loggedin] = useAuth()

    const [open, setOpen] = useState<boolean>(false)
    const dropRef = useRef<HTMLDivElement>(null)
    const focus = (state: boolean) => {
        setOpen(!state)
    }
    const collapseOutside = (e: any) => {
        if (open && !dropRef.current?.contains(e.target as Node)) setOpen(false)

        // ↑↑ warum funktioniert das nicht?? ↑↑
    }
    window.addEventListener("click", collapseOutside)

    return (
        <div>
            <nav className="rt_navigation default_nav" ref={dropRef}>
                <div className="navigation-logo container-nav">
                    <Link to="/" className="logoContainer">
                        <img src="./img/rapidtyper-logo.png" alt="Logo" className="src_logo" />
                    </Link>
                </div>
                <div className="navigation-link container-nav">
                    <ul className="_linklisting">
                        <li className="nav-link-item">
                            <Link to="/about">
                                <span className="link_call">About</span>
                            </Link>
                        </li>
                        <li className="nav-link-item">
                            <Link to="#" onClick={(e) => focus(open)}>
                                <span className="link_call">Play</span>
                                <span className="navicon">
                                    <svg className="d-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                                    </svg>
                                </span>
                            </Link>
                            {open && (
                                <ul className="dropdown_container">
                                    <li className="dropdown_item" style={{ marginBottom: 14 }}>
                                        <Link to="/singleplayer" className="noscale">
                                            <div className="nv-groupsvg">
                                                <svg className="cnvsvg" viewBox="0 0 865 448" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M745 160L636.3 24.1C624.1 8.85 605.7 0 586.3 0H380.4C354.15 0 330.65 15.88 320.9 40.25L273 162.3C245.5 169.4 225 194.3 225 224V336C225 353.67 239.33 368 257 368C257 306.2 307.24 256 369 256C430.76 256 481 306.2 481 368H609C609 306.24 659.24 256 721 256C782.76 256 833 306.24 833 368C850.67 368 865 353.67 865 336V280C865 213.7 811.3 160 745 160ZM449 160H341.9L380.4 64H449V160ZM497 160V64H586.25L663 160H497Z"
                                                        fill="#fff"
                                                    />
                                                    <path
                                                        d="M721 288C676.82 288 641 323.82 641 368C641 412.18 676.82 448 721 448C765.18 448 801 412.18 801 368C801 323.8 765.2 288 721 288ZM369 288C324.82 288 289 323.8 289 368C289 412.2 324.82 448 369 448C413.18 448 449 412.2 449 368C449 323.8 413.2 288 369 288ZM341.9 160H449V64H380.4L341.9 160ZM586.3 64H497V160H662.1L586.3 64Z"
                                                        fill="#2563eb"
                                                    />
                                                    <rect x="75" y="43" width="150" height="30" rx="15" fill="#2563eb" />
                                                    <path
                                                        d="M49 391C49 382.716 55.7157 376 64 376H184C192.284 376 199 382.716 199 391V391C199 399.284 192.284 406 184 406H64C55.7157 406 49 399.284 49 391V391Z"
                                                        fill="#fff"
                                                    />
                                                    <rect y="154" width="150" height="30" rx="15" fill="#fff" />
                                                    <rect y="265" width="150" height="30" rx="15" fill="#2563eb" />
                                                </svg>
                                            </div>
                                            <div className="nvt">
                                                <h2 className="link_call large">Singleplayer</h2>
                                                <p className="description_sd2">Practice your typing</p>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="dropdown_item">
                                        <Link to="/multiplayer" className="noscale">
                                            <div className="nv-groupsvg">
                                                <svg className="cnvsvg" viewBox="0 0 1027 514" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M745 160L636.3 24.1C624.1 8.85 605.7 0 586.3 0H380.4C354.15 0 330.65 15.88 320.9 40.25L273 162.3C245.5 169.4 225 194.3 225 224V336C225 353.67 239.33 368 257 368C257 306.2 307.24 256 369 256C430.76 256 481 306.2 481 368H609C609 306.24 659.24 256 721 256C782.76 256 833 306.24 833 368C850.67 368 865 353.67 865 336V280C865 213.7 811.3 160 745 160ZM449 160H341.9L380.4 64H449V160ZM497 160V64H586.25L663 160H497Z"
                                                        fill="#fff"
                                                    />
                                                    <path
                                                        d="M721 288C676.82 288 641 323.82 641 368C641 412.18 676.82 448 721 448C765.18 448 801 412.18 801 368C801 323.8 765.2 288 721 288ZM369 288C324.82 288 289 323.8 289 368C289 412.2 324.82 448 369 448C413.18 448 449 412.2 449 368C449 323.8 413.2 288 369 288ZM341.9 160H449V64H380.4L341.9 160ZM586.3 64H497V160H662.1L586.3 64Z"
                                                        fill="#2563eb"
                                                    />
                                                    <rect x="75" y="43" width="150" height="30" rx="15" fill="#2563eb" />
                                                    <path
                                                        d="M49 391C49 382.716 55.7157 376 64 376H184C192.284 376 199 382.716 199 391V391C199 399.284 192.284 406 184 406H64C55.7157 406 49 399.284 49 391V391Z"
                                                        fill="#fff"
                                                    />
                                                    <rect y="154" width="150" height="30" rx="15" fill="#fff" />
                                                    <rect y="265" width="150" height="30" rx="15" fill="#2563eb" />
                                                    <g clipPath="url(#clip0_9_33)">
                                                        <path
                                                            d="M572.029 393.072H519.971C470.844 393.072 431 432.911 431 482.043C431 491.869 438.968 499.842 448.794 499.842H643.216C653.042 499.857 661 491.9 661 482.043C661 432.911 621.161 393.072 572.029 393.072Z"
                                                            fill="#fff"
                                                        />
                                                        <path
                                                            d="M611.714 302.714C611.714 339.006 582.297 368.429 546 368.429C509.703 368.429 480.286 339.011 480.286 302.714C480.286 266.417 509.708 237 546 237C582.297 237 611.714 266.423 611.714 302.714Z"
                                                            fill="#2563eb"
                                                        />
                                                    </g>
                                                    <path
                                                        d="M924.029 393.072H871.971C822.844 393.072 783 432.911 783 482.043C783 491.869 790.968 499.842 800.794 499.842H995.216C1005.04 499.857 1013 491.9 1013 482.043C1013 432.911 973.161 393.072 924.029 393.072Z"
                                                        fill="#fff"
                                                    />
                                                    <path
                                                        d="M963.714 302.714C963.714 339.006 934.297 368.429 898 368.429C861.703 368.429 832.286 339.011 832.286 302.714C832.286 266.417 861.708 237 898 237C934.297 237 963.714 266.423 963.714 302.714Z"
                                                        fill="#2563eb"
                                                    />
                                                    <defs>
                                                        <clipPath id="clip0_9_33">
                                                            <rect width="230" height="262.857" fill="white" transform="translate(431 237)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div className="nvt">
                                                <h2 className="link_call large">Mulitplayer</h2>
                                                <p className="description_sd2">Compete against others</p>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="nav-link-item">
                            <Link to="/account">{loggedin ? <span className="link_call">Account</span> : <span className="link_call">Login</span>}</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            {children}
        </div>
    )
}
//
