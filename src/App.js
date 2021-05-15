import React, {useState, useEffect} from 'react'
import Sample from '../Sample.js';
import SampleWASM from '../Sample.wasm';

import {Input, Radio} from 'antd';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChessPawn, faChessKnight, faChessBishop, faChessRook, faChessQueen, faChessKing} from '@fortawesome/free-solid-svg-icons'
const pieceIconMap = {
    'p': faChessPawn, 'n': faChessKnight, 'b': faChessBishop, 
    'r': faChessRook, 'q': faChessQueen, 'k': faChessKing
};
const buttonStyle = {
    border:"8px solid #94e5ff", borderRadius:"15px",
    fontSize:"30px", padding:"5px 10px", backgroundColor:"white"
}
const defaultBoard = "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR";



const sample = Sample({
    locateFile: () => {
        return SampleWASM;
    },
});


const App = () => {

    //game states
    const [score, setScore] = useState(0)
    const [board, setBoard] = useState({boardStr: defaultBoard, turn: true})

    //on-going states
    const [playerMoves, setPlayerMoves] = useState("")
    const [selection, setSelection] = useState(-1)
    const [checkedSq, setCheckedSq] = useState(-1)

    //settings
    const [playerTurn, setPlayerTurn] = useState(true)
    const [pieceVisibility, setPieceVisibility] = useState(false)
    const [flipped, setFlipped] = useState(false)
    const [level, setLevel] = useState(1)
    useEffect(() => {
        sample.then((core) => {core.setLevel(level)})
    }, [level])



    //initalize engine and game
    useEffect(() => {
        sample.then((core) => {
            core.setUp();
            setPlayerMoves(core.getLegals(board.turn, board.boardStr));
            core.setLevel(level);
        });
        if (!localStorage.getItem('highScore')) {
            localStorage.setItem('highScore', '0')
        }
    }, [])



    //move handler
    useEffect(() => {
        determineChecks()
        playTurn()
    }, [board.turn])
    const determineChecks = () => {
        setCheckedSq(-1);
        sample.then((core) => {
            if (core.isCheck()) {
                console.log("Check!")
                setCheckedSq(board.boardStr.indexOf(board.turn? "K" : 'k'));
            }
        });
    }
    const playTurn = () => {
        console.log(playerTurn)
        if (playerTurn != board.turn) {
            sample.then((core) => {
                const newBoard = core.playEngMove(board.turn, board.boardStr);
                if (newBoard == "checkmate") {
                    setScore(score+100)
                } else if (newBoard == "draw"){
                    setScore(score)
                } else {
                    setBoard({
                        ...board,
                        boardStr: newBoard,
                        turn: !board.turn
                    });
                }
            });
        } else {
            sample.then((core) => {
                const legalMoves = core.getLegals(board.turn, board.boardStr)
                if (playerMoves.length == 0) {
                    setScore(core.isCheck()? score : score) // no penalty for being mated
                } else {
                    setPlayerMoves(legalMoves);
                }
            });
            
            setScore(pieceVisibility? score - 10 : score + 10 + level*2)
        }
    }
    const playFirstTurn = (pturn) => {

        setPlayerTurn(pturn)
        setFlipped(!pturn)
        if (score > Number(localStorage.getItem('highScore'))) {
            localStorage.setItem('highScore', score)
        }
        setScore(0)

        sample.then((core) => {
            if (pturn != true) {
                setBoard({
                    ...board,
                    boardStr: core.playEngMove(true, defaultBoard),
                    turn: false
                });
            } else {
                setPlayerMoves(core.getLegals(true, defaultBoard));
                setBoard({boardStr: defaultBoard, turn: true})
            }
        });

    }



    //various state controlling and other functions
    const dimensions = window.innerWidth - 60;
    const materialEvalAcc = () => {
        var evaluation = 0
        for (var i=0; i<64; i++) {
            switch(board.boardStr[i]) {
                case 'p': evaluation-=1; break;
                case 'n': evaluation-=3; break;
                case 'b': evaluation-=3; break;
                case 'r': evaluation-=5; break;
                case 'q': evaluation-=9; break;
                case 'P': evaluation+=1; break;
                case 'N': evaluation+=3; break;
                case 'B': evaluation+=3; break;
                case 'R': evaluation+=5; break;
                case 'Q': evaluation+=9; break;
            }
        }
        return evaluation
    }
    const testSelection = (from, to) => {
        const isLegal = (playerMoves.indexOf(`${from}${to}`) != -1)
        if (isLegal) {
            setCheckedSq(-1);
        }
        return isLegal
    }
    const isOwnColor = (character) => {
        if (character == " ") {
            return false;
        } else {
            return (
                character == 
                (board.turn? character.toUpperCase() : character.toLowerCase())
            )
        }
    }
    const handleSelect = (sq) => {
        if (selection == -1) {
            if (isOwnColor(board.boardStr[sq])) {
                setSelection(sq)
            } else {
                setSelection(-1)
            }
        } else {
            if (sq == selection) {
                setSelection(-1)
            } else if (isOwnColor(board.boardStr[sq])) {
                setSelection(sq)
            } else { //attempted move
                if (testSelection(selection, sq)) {
                    sample.then((core) => {
                        setBoard({
                            ...board, 
                            boardStr: core.makeMove(board.boardStr, selection, sq, board.turn),
                            turn: !board.turn
                        });
                    });
                }
                setSelection(-1)
            }
        }
    }



    //visual output
    return (
        <div style={{display:"flex", alignItems:"center", flexDirection:"column", fontWeight:"600"}}>
            


            {/* title and score */}
            <div style={{fontSize:"50px", margin:"30px 0 50px 0"}}>Memory Chess by Arnav Mehra</div>
            <div style={{
                display:"flex", justifyContent:"space-between", 
                fontSize:"40px", fontWeight:"600",
                marginBottom:"20px", width: dimensions/1.4,
            }}>
                <div>Current Score: {score + materialEvalAcc()*20}</div>
                <div>High Score: {localStorage.getItem('highScore')}</div>
            </div>
            


            {/* black box: board and lower buttons */}
            <div style={{border:"12px solid black", borderRadius:"25px", background:"black"}}>



                {/* board */}
                <div style={{width: dimensions + "px", height: dimensions + "px", background:"white", borderRadius:"15px"}}>
                    {[0,1,2,3,4,5,6,7].map((row) => 
                        <div style={{display:"flex"}}>
                            {[0,1,2,3,4,5,6,7].map((col) => {

                                var isBlack = (row + col)%2
                                var sq = flipped? 63 - (row*8+col) : row*8+col;
                                var piece = board.boardStr[sq]
                                    
                                return (
                                    <div
                                        style={{
                                            width: dimensions/8 + "px", height: dimensions/8 + "px", 
                                            backgroundColor:
                                                checkedSq == sq? "#ae0009":
                                                isBlack? "#94e5ff":
                                                "white", 
                                            borderRadius: "15px",
                                            fontSize: selection == sq? "85px" : "75px",
                                            display:"flex", justifyContent:"center", alignItems:"center"
                                        }}
                                        onClick={() => {handleSelect(sq)}}
                                    >
                                        {piece != " " &&
                                            <FontAwesomeIcon
                                                icon={pieceVisibility? pieceIconMap[piece.toLowerCase()] : faChessPawn}
                                                style={{color: piece == piece.toUpperCase()? "#aaaaaa" : "black"}}
                                            />
                                        }
                                    </div>
                                )

                            })}
                        </div>
                    )}
                </div>



                {/* first row of buttons */}
                <div style={{marginTop:"20", display:"flex", justifyContent:"space-between", width: dimensions}}>
                    
                    <div style={{display:"flex", fontSize:"30px", alignItems:"center", ...buttonStyle}}>
                        <div>Set Level (1-5):</div>
                        &nbsp;&nbsp;
                        <Radio.Group
                            options={[{value: 1},{value: 2},{value: 3},{value: 4},{value: 5}]}
                            onChange={(e) => {
                                setLevel(e.target.value)
                            }}
                            value={level}
                        >
                            {[1,2,3,4,5].map((n) => 
                                <Radio.Button value={n}>{n}</Radio.Button>
                            )}
                        </Radio.Group>
                    </div>
                    
                    <div style={{display:"flex"}}>
                        <div
                            style={buttonStyle}
                            onClick={() => {
                                playFirstTurn(true)
                            }}
                        >Reset W/ White</div>
                        &nbsp;&nbsp;
                        <div
                            style={buttonStyle}
                            onClick={() => {
                                playFirstTurn(false)
                            }}
                        >Reset W/ Black</div>
                    </div>

                </div>



                {/* second row of buttons */}
                <div style={{marginTop:"15px", display:"flex", justifyContent:"space-between", width: dimensions}}>
                    <div
                        style={buttonStyle}
                        onClick={() => {
                            if (!pieceVisibility) {
                                setScore(score - 25)
                            }
                            setPieceVisibility(!pieceVisibility)
                        }}
                    >
                        Toggle Piece Visibility (-25 Points)
                    </div>
                </div>
                

            </div>
            
        </div>
    )
}

export default App
