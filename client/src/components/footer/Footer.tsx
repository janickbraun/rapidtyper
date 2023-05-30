import React from "react"
import "./footer.css"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        // footer
        <footer className="globalfooter rt-footer">
            <section className="innerfooter">
                <ul className="linksfooter">
                    <li className="footeritem">
                        <Link to="/about">About</Link>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <a href="//grovider.co/privacy-policy">Privacy Policy</a>
                    </li>
                    <span>•</span>
                    <li className="footeritem">
                        <a href="./imprint.html">Imprint</a>
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
