import React from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

export default function Header({ children }: { children: React.ReactNode }) {
    const [loggedin] = useAuth()
    return (
        <div>
            <nav>
                <div className="navigation-logo container-nav">
                    <Link to="/">{/* index */}<img src="" alt="Logo" /></Link>
                </div>
                <div className="navigation-link container-nav">
                    <ul className="_linklisting">
                        <li className="nav-link-item">
                            <Link to="/about">
                                <span className="link_call">About</span>
                            </Link>
                        </li>
                        <li className="nav-link-item">
                            <Link to="/about">
                                <span className="link_call">About</span>
                            </Link>
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
