import React from "react"
import "./footer.css"

export default function Footer() {
  return (
    <footer className="globalfooter rt-footer">
      <section className="innerfooter">
        <div className="__ftsc listsc">
          <ul className="ftlink-list">
            <h2 className="ftcaller">Overview</h2>
                <li className="ftlinkitem">
                      <a className="ftlink" href="/about">About</a>
                </li>
                <li className="ftlinkitem">
                      <a className="ftlink" href="/story">How it wokrs</a>
                </li>
          </ul>
        </div>
        <div className="__ftsc listsc">
          <ul className="ftlink-list">
            <h2 className="ftcaller">Legal</h2>
                <li className="ftlinkitem">
                      <a className="ftlink" href="//grovider.co/privacy-policy">Privacy Policy</a>
                </li>
                <li className="ftlinkitem">
                      <a className="ftlink" href="./imprint.html">Imprint</a>
                </li>
            </ul>
        </div>
        <div className="__ftsc listsc">
          <ul className="ftlink-list">
            <h2 className="ftcaller">Help</h2>
                <li className="ftlinkitem">
                      <a className="ftlink" href="/how-to-play.html">How to play</a>
                </li>
                <li className="ftlinkitem">
                      <a className="ftlink" href="/contact">Contact</a>
                </li>
            </ul>
        </div>
        <div className="__ftsc copysc">
          <div className="__logoftctcopy">
            <img src="./img/rapidtyper-logo.png" alt="Logo" height={45} className="ftlogoimg" />
          </div>
          <div className="copytxtsect">
            <p className="copyrighttxt">&copy;2023 RapidTyper</p>
            <p className="copyby"><small>von Luis und Janick</small></p>
          </div>
        </div>
      </section>
    </footer>
  )
}
