import React from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import "./header.css"

export default function Header({ children }: { children: React.ReactNode }) {
    const [loggedin] = useAuth()
    return (
        <div>
            <nav className="rt_navigation default_nav">
                <div className="navigation-logo container-nav">
                    <Link to="/" className="logoContainer">{/* index */}<img src="./img/rapidtyper-logo.png" alt="Logo" className="src_logo" /></Link>
                </div>
                <div className="navigation-link container-nav">
                    <ul className="_linklisting">
                        <li className="nav-link-item">
                            <Link to="/about">
                                <span className="link_call">About</span>
                            </Link>
                        </li>
                        <li className="nav-link-item">
                            <Link to="#">
                                <span className="link_call">Play</span>
                                <span className="navicon"><svg className="d-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></span>
                            </Link>
                            <ul className="dropdown_container" hidden>
                                <li className="dropdown_item">
                                    <Link to="/play/single">
                                        <span className="link_call">Singleplayer</span>
                                    </Link>
                                </li>
                                <li className="dropdown_item">
                                    <Link to="/play/lobby">
                                        <span className="link_call">Mulitplayer</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-link-item">
                            <Link to="/account">
                                {loggedin ? (
                                    <span className="link_call">Account</span>
                                ) : (
                                    <span className="link_call">Login</span> 
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {children}
        </div>
    )
}
