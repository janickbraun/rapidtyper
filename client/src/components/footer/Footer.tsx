import React from "react"
import "./footer.css"
import { Link } from "react-router-dom"
import useIsInGame from "../../hooks/useIsInGame"

export default function Footer() {
    const [isInGame] = useIsInGame()

    return (
        // footer
        <footer className="globalfooter rt-footer">
            <section className="innerfooter">
                <ul className="linksfooter">
                    <li className="footeritem">
                        <Link reloadDocument={isInGame} to="//feedback.rapidtyper.com">
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
                        <Link to="/privacy-policy" reloadDocument={isInGame}>
                            Privacy Policy
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
                        &copy;2023 RapidTyper - von Luis und{" "}
                        <a style={{ textDecoration: "none", color: "white" }} target="_blank" rel="noreferrer" href="https://www.instagram.com/jan1ck.braun/">
                            Janick
                        </a>
                    </p>
                </div>
            </section>
        </footer>
    )
}

/*

About(incl. how it works)
Privacy Policy
Imprint
How to play
Copyright

*/
