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

        if (skin === "wpm") {
            if (speed >= 20) unlock("sloth", user, speed)
            if (speed >= 25) unlock("turtle", user, speed)
            if (speed >= 30) unlock("frog", user, speed)
            if (speed >= 35) unlock("chicken", user, speed)
            if (speed >= 40) unlock("pig", user, speed)
            if (speed >= 42) unlock("elephant", user, speed)
            if (speed >= 45) unlock("human", user, speed)
            if (speed >= 49) unlock("kangaroo", user, speed)
            if (speed >= 55) unlock("rabbit", user, speed)
            if (speed >= 60) unlock("dog", user, speed)
            if (speed >= 70) unlock("horse", user, speed)
            if (speed >= 80) unlock("shark", user, speed)
            if (speed >= 100) unlock("cheetah", user, speed)
            if (speed >= 200) unlock("falcon", user, speed)
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
