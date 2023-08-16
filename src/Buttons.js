import React from 'react';

const blue = '#94e5ff';
const white = 'white';

const buttonStyle = {
    width: "50%",
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: "white",
    cursor: "none",
    fontWeight: "bold",
};

const buttonLineStyle = {
    marginTop: "5px",
    width: "100%",
    gap: 4,
    display: "flex"
};

const Buttons = ({
    playFirstTurn
}) => {
  return (
    <div style={buttonLineStyle}>
        <button
            style={{ ...buttonStyle, backgroundColor: white }}
            onClick={() => {
                playFirstTurn(true)
            }}
        >
            Reset With White
        </button>
        <button
            style={{ ...buttonStyle, backgroundColor: blue }}
            onClick={() => {
                playFirstTurn(false)
            }}
        >
            Reset With Black
        </button>
    </div>  
  )
}

export default Buttons