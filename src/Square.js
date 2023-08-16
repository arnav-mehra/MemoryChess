import React from 'react';

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    faChessPawn,
    faChessKnight,
    faChessBishop,
    faChessRook,
    faChessQueen,
    faChessKing
} from '@fortawesome/free-solid-svg-icons';

const pieceIconMap = {
    'p': faChessPawn,
    'n': faChessKnight,
    'b': faChessBishop, 
    'r': faChessRook,
    'q': faChessQueen,
    'k': faChessKing
};

const Square = ({
    sq,
    piece,
    isBlackSq,
    handleSelect,
    selection,
    checkedSq
}) => {
    const icon = pieceIconMap[piece.toLowerCase()];
    const iconColor = piece == piece.toUpperCase() ? "#aaaaaa" : "black";

    return (                                    
        <div
            style={{
                width: "12.5%",
                padding: "6.25% 0",
                height: 0,
                backgroundColor: (
                    checkedSq == sq ? "#ae0009"
                        : isBlackSq ? "#94e5ff"
                        : "white"
                ),
                fontSize: selection == sq ? "25px" : "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
            onClick={() => handleSelect(sq)}
        >
            {piece != " " &&
                <FontAwesomeIcon
                    icon={icon}
                    color={iconColor}
                    size={'3x'}
                />
            }
        </div>
    );
};

export default Square;