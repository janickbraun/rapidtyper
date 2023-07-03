import React from "react"
import "./footer.css"
import { Link } from "react-router-dom"
import useIsInGame from "../../hooks/useIsInGame"
import { unlockSkin } from "../../helpers/skinHelper"

export default function Footer() {
    const [isInGame] = useIsInGame()

    const handleSkin = (skin: string) => {
        unlockSkin(skin)
    }

    return (
        <footer className="globalfooter rt-footer">
            <section className="innerfooter">
                <ul className="linksfooter">
                    <li className="footeritem">
                        <Link reloadDocument={isInGame} to="/feedback">
                            Leave Feedback
                        </Link>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <Link reloadDocument={isInGame} to="/about">
                            About
                        </Link>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <a className="ftext" target="_blank" rel="noreferrer" href="https://github.com/janickbraun/rapidtyper" onClick={() => handleSkin("cat")}>
                            GitHub
                        </a>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <Link to="//grovider.co/privacy-policy" className="ftext" reloadDocument={isInGame}>
                            Privacy Policy
                        </Link>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <Link to="/terms-of-service" reloadDocument={isInGame}>
                            Terms
                        </Link>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <Link to="/imprint" reloadDocument={isInGame}>
                            Imprint
                        </Link>
                    </li>
                </ul>
                <div className="copyright">
                    <p className="copyrighttxt">
                        &copy;2023 RapidTyper - by{" "}
                        <a style={{ textDecoration: "none", color: "white" }} target="_blank" rel="noreferrer" href="https://www.instagram.com/baum062/" onClick={() => handleSkin("capybara")}>
                            Luis
                        </a>{" "}
                        &{" "}
                        <a style={{ textDecoration: "none", color: "white" }} target="_blank" rel="noreferrer" href="https://www.instagram.com/jan1ck.braun/" onClick={() => handleSkin("capybara")}>
                            Janick
                        </a>
                    </p>
                </div>
            </section>
        </footer>
    )
}
