import React from "react"
import "./footer.css"
import { Link } from "react-router-dom"
import useIsInGame from "../../hooks/useIsInGame"

export default function Footer() {
    const [isInGame] = useIsInGame()

    return (
        <footer className="globalfooter rt-footer">
            <section className="innerfooter">
                <ul className="linksfooter">
                    <li className="footeritem">
                        <a className="ftext" rel="noreferrer" href="//feedback.rapidtyper.com">
                            Leave Feedback
                        </a>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <Link reloadDocument={isInGame} to="/about">
                            About
                        </Link>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <a className="ftext" target="_blank" rel="noreferrer" href="https://github.com/janickbraun/rapidtyper">
                            GitHub
                        </a>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <Link to="//grovider.co/privacy-policy" reloadDocument={isInGame}>
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
                        &copy;2023 RapidTyper - von{" "}
                        <a style={{ textDecoration: "none", color: "white" }} target="_blank" rel="noreferrer" href="https://www.instagram.com/baum062/">
                            Luis
                        </a>{" "}
                        &{" "}
                        <a style={{ textDecoration: "none", color: "white" }} target="_blank" rel="noreferrer" href="https://www.instagram.com/jan1ck.braun/">
                            Janick
                        </a>
                    </p>
                </div>
            </section>
        </footer>
    )
}
