import React, { useEffect } from "react"
import { motion, Variants } from "framer-motion";

export default function About() {
    useEffect(() => {
        document.title = "About | RapidTyper"
    }, [])

    const cardVariants: Variants = {
        offscreen: {
          y: 100
        },
        onscreen: {
          y: 50,
          transition: {
            type: "spring",
            bounce: 0.2,
            duration: 0.8
          }
        }
    };

    return (
        <main>
            <h1>About</h1>
            <div>
            <motion.div
                className="flanimate aabout"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: false, amount: 0.8 }}
            >
                <motion.div className="card" variants={cardVariants}>
                <p>
                    RapidTyper is a cutting-edge web application designed to help users enhance their typing skills and become proficient keyboard users. Whether you're a professional looking to increase
                    your productivity or a beginner aiming to improve your typing speed, RapidTyper provides a fun and interactive platform to achieve your goals.
                </p>
                </motion.div>
                
            </motion.div>
            </div>

            <h2>Our Mission</h2>
            <p>
                At RapidTyper, our mission is to empower individuals to become faster, more accurate typists. We believe that effective typing skills are essential in today's digital world, where
                efficient communication and productivity go hand in hand. Our goal is to create an engaging and user-friendly platform that not only improves typing abilities but also makes the
                learning process enjoyable and rewarding.
            </p>

            <h2>How it Works</h2>
            <p>RapidTyper offers a range of features to help you boost your typing skills:</p>

            <h3>Typing Races</h3>
            <p>
                Engage in exciting typing races against other players and challenge your friends to see who can type the fastest and most accurately. Test your speed and accuracy under pressure as you
                strive to outperform your competitors and climb the leaderboards.
            </p>

            <h3>Statistics</h3>
            <p>
                RapidTyper provides you with comprehensive typing statistics and allows you to track your progress over time. By offering detailed insights into your typing speed, accuracy, and
                performance, RapidTyper enables you to understand your strengths and areas for improvement.
            </p>

            <p>
                If you have any questions, suggestions, or feedback, we'd love to hear from you! Contact us at <a href="mailto:support@mail.rapidtyper.com">support@mail.rapidtyper.com</a>. Thank you for
                choosing RapidTyper as your partner in improving your typing skills!
            </p>
        </main>
    )
}
