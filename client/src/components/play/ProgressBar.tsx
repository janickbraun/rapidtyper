import React from "react"

/*
  --> RaceCar.tsx
*/

const ProgressBar = (props: any) => {
    const { bgcolor, completed } = props

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
    
    var color:string = "black"
    
    if(completed >= 2) {
        color = "white"
    }else{
        color = "black"
    }
    
    const labelStyles:object = { // type (object/any) weil sonst fehler wegen "position: absolute;"
        padding: 5,
        color: color,
        fontWeight: "bold",
        left: 5,
        top: "50%",
        transform: "translateY(-50%)",
        position: "absolute",
    }
    
    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${Math.round(completed)}%`}</span>
            </div>
        </div>
    )
}

export default ProgressBar
