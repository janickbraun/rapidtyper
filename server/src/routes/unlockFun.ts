import Lobby from "../../models/Lobby"
import User from "../../models/User"

export const unlock = async (skin: string, user: any, speed: any) => {
    try {
        const validSkins = [
            "ape",
            "bee",
            "bird",
            "capybara",
            "cat",
            "cheetah",
            "chicken",
            "dino",
            "dog",
            "dog-poop",
            "duck",
            "elephant",
            "falcon",
            "fly",
            "frog",
            "hood-irony",
            "horse",
            "human",
            "kangaroo",
            "lion",
            "octopus",
            "pig",
            "rabbit",
            "rabbit-running",
            "shark",
            "sloth",
            "snail",
            "turtle",
            "whale",
            "wpm",
        ]

        if (!validSkins.includes(skin)) return
        if (!user) return

        const skins = user.skins

        if (skins.includes(skin)) return

        console.log("thfe ", speed)

        if (skin === "wpm") {
            console.log(speed)
        } else {
            await User.findByIdAndUpdate(user.id, {
                $push: {
                    skins: skin,
                },
            })
        }
    } catch (e) {
        console.log(e)
    }
}
