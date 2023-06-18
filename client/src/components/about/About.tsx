import React, { useEffect } from "react"

export default function About() {
    useEffect(() => {
        document.title = "About | RapidTyper"
    }, [])

    return (
        <main className="abt_">
            <div className="contentloaded-main">
                <h1 className="about__ht">About RapidTyper</h1>
                <div className="__quote">
                    <figure className="__fndimg">
                        <img src="/img/about/founder.png" alt="Janick & Luis" className="_frg_founders" loading="lazy" />
                        <span className="img_subtxt" hidden></span>
                    </figure>
                    <div className="__quotetext_continer">
                        <small>A quote from the founders:</small>
                        <p className="__quotetext_">
                            <span className="__wkk">
                                This image is loaded lazy&nbsp;<span className="emoji">🍻</span>
                            </span>
                        </p>
                    </div>
                </div>
                <div className="ucv">
                    <h2>What is RapidTyper?</h2>
                    <div className="__dcflexcontent">
                        <p className="about__text">
                            RapidTyper is a cutting-edge web application designed to help users enhance their typing skills and become proficient keyboard users. Whether you're a professional looking
                            to increase your productivity or a beginner aiming to improve your typing speed, RapidTyper provides a fun and interactive platform to achieve your goals.
                        </p>
                        <figure className="rtsplash">
                            <img className="displayreal" src="/img/splash.png" alt="" />
                        </figure>
                    </div>
                </div>
                <div className="ucv">
                    <h2>Our Mission</h2>
                    <div className="__dcflexcontent">
                        <p className="about__text">
                            At RapidTyper, our mission is to empower individuals to become faster, more accurate typists. We believe that effective typing skills are essential in today's digital
                            world, where efficient communication and productivity go hand in hand. Our goal is to create an engaging and user-friendly platform that not only improves typing abilities
                            but also makes the learning process enjoyable and rewarding.
                        </p>
                    </div>
                </div>
                <div className="ucv">
                    <h2>How it Works</h2>
                    <div className="__dcflexcontent">
                        <p className="about__text">RapidTyper offers a range of features to help you boost your typing skills:</p>
                    </div>
                </div>
                <div className="ucvdd">
                    <h3>Typing Races</h3>
                    <div className="__dcflexcontent">
                        <p className="about__text">
                            Engage in exciting typing races against other players and challenge your friends to see who can type the fastest and most accurately. Test your speed and accuracy under
                            pressure as you strive to outperform your competitors and climb the leaderboards.
                        </p>
                    </div>
                </div>
                <div className="ucvdd">
                    <h3>Statistics</h3>
                    <div className="__dcflexcontent">
                        <p className="about__text">
                            RapidTyper provides you with comprehensive typing statistics and allows you to track your progress over time. By offering detailed insights into your typing speed,
                            accuracy, and performance, RapidTyper enables you to understand your strengths and areas for improvement.
                        </p>
                    </div>
                </div>
                <div className="ucv">
                    <h2>Contact</h2>
                    <div className="__dcflexcontent">
                        <p className="about__text">
                            If you have any questions, suggestions, or feedback, we'd love to hear from you! Contact us at{" "}
                            <a className="c" href="mailto:support@mail.rapidtyper.com">
                                support@mail.rapidtyper.com
                            </a>
                            . Thank you for choosing RapidTyper as your partner in improving your typing skills!
                        </p>
                    </div>
                </div>
                <div className="ucv">
                    <h2>
                        🗿🗣️🗣️🗣️🔥❗❗‼️⁉️🤣🤣💀💀😭😭
                        <img src="/img/skullrotate.gif" height={42} style={{ position: "absolute" }} alt="" />
                    </h2>
                    <div className="__dcflexcontent">
                        <div className="__ffcmemecontainer">
                            {/* rt_development.webp */}
                            <div className="__quote ">
                                <figure className="__fndimg">
                                    <img src="/img/rt_development.gif" alt="Janick & Luis" className="_frg_founders" loading="lazy" />
                                    <span className="img_subtxt" hidden></span>
                                </figure>
                                <div className="__quotetext_continer _qs3">
                                    <small>Some other quote from a random individual:</small>
                                    <p className="__quotetext_">
                                        <span className="__wkk rdefault">← Us after the application successfully built</span>
                                    </p>
                                </div>
                            </div>
                            <div className="__quote ">
                                <figure className="__fndimg">
                                    <img src="/img/gtaxesc.gif" alt="Janick & Luis" className="_frg_founders" loading="lazy" />
                                    <span className="img_subtxt" hidden></span>
                                </figure>
                                <div className="__quotetext_continer _qs3">
                                    <small>Janick just made that sh*t up:</small>
                                    <p className="__quotetext_">
                                        <span className="__wkk rdefault">← Us running from German Finanzamt </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
