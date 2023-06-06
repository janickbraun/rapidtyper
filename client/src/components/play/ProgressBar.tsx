import React from "react"

const ProgressBar = (props: any) => {
    const { bgcolor, completed, name, skin } = props

    const containerStyles = {
        height: 20,
        width: "50%",
        backgroundColor: "#e0e0de",
        borderRadius: "50rem",
        margin: 50,
    }

    const fillerStyles: any = {
        height: "100%",
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: "inherit",
        textAlign: "right",
        position: "relative",
    }

    let color: string = "black"

    if (completed >= 97) {
        color = "white"
    } else {
        color = "black"
    }

    const labelStyles: object = {
        padding: 5,
        color: color,
        fontWeight: "bold",
        top: "200%",
        transform: "translate(-0px, -138%)",
        position: "absolute",
        width: 100,
        textAlign: "left",
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>
                    {name + ` ${Math.round(completed)}%`}
                    <img style={{ width: 50, height: 50, position: "absolute" }} src={"/img/skins/" + skin + ".png"} alt="skin" />
                </span>
            </div>
        </div>
    )
}

export default ProgressBar
