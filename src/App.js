import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-solid-svg-icons';

import Sample from '../Sample.js';
import SampleWASM from '../Sample.wasm';
import Buttons from './Buttons.js';
import Square from './Square.js';
import Mouse from './Mouse.js';

const sample = Sample({
    locateFile: () => SampleWASM
});

const defaultBoard = "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR";
const dimArr = [ 0, 1, 2, 3, 4, 5, 6, 7 ];

const App = () => {
    const el = document.getElementsByTagName('body')[0];
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
    el.style.margin = 0;
    el.style.background = "black";
    el.style.fontSize = 20;

    // game states
    const [ board, setBoard ] = useState({
        boardStr: defaultBoard,
        turn: true
    });
    const [ playerMoves, setPlayerMoves ] = useState("");
    const [ selection, setSelection ] = useState(-1);
    const [ checkedSq, setCheckedSq ] = useState(-1);

    // settings
    const [ playerTurn, setPlayerTurn ] = useState(true);
    const [ flipped, setFlipped ] = useState(false);

    // initalize engine and game
    useEffect(() => {
        sample.then((core) => {
            core.setUp();
            setPlayerMoves(core.getLegals(board.turn, board.boardStr));
            core.setLevel(3);
        });
    }, []);

    // move handler
    useEffect(() => {
        determineChecks();
        playTurn();
    }, [board.turn]);

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
        if (playerTurn == board.turn) {
            // player turn
            sample.then(core => {
                const legalMoves = core.getLegals(board.turn, board.boardStr);
                if (legalMoves.length != 0) {
                    setPlayerMoves(legalMoves);
                } else {
                    if (core.isCheck()) {
                        alert("Checkmate! You have lost.");
                    } else {
                        alert("Stalemate! The game is a draw.");
                    }
                }
            });
        } else {
            // engine turn
            sample.then(core => {
                const newBoard = core.playEngMove(board.turn, board.boardStr);
                if (newBoard == "checkmate") {
                    alert("Checkmate! You have won.");
                } else if (newBoard == "draw") {
                    alert("Stalemate! The game is a draw.");
                } else {
                    setBoard({
                        boardStr: newBoard,
                        turn: !board.turn
                    });
                }
            });
        }
    };

    const playFirstTurn = (pturn) => {
        setCheckedSq(-1)
        setSelection(-1)
        setPlayerTurn(pturn)
        setFlipped(!pturn)

        sample.then((core) => {
            if (pturn != true) {
                var newBoard = core.playEngMove(true, defaultBoard)
                setBoard({
                    boardStr: newBoard,
                    turn: false
                });
                setPlayerMoves(core.getLegals(false, newBoard));
            } else {
                setPlayerMoves(core.getLegals(true, defaultBoard));
                setBoard({
                    boardStr: defaultBoard,
                    turn: true
                })
            }
        });

    };
    
    const testSelection = (from, to) => {
        const isLegal = (playerMoves.indexOf(`${from+10}${to+10}`) != -1);
        if (isLegal) {
            setCheckedSq(-1);
        }
        return isLegal;
    };

    const isOwnColor = (character) => {
        if (character == " ") return false;
        const ownColored = board.turn ? character.toUpperCase()
                                      : character.toLowerCase();
        return character == ownColored;
    };

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
                            boardStr: core.makeMove(board.boardStr, selection, sq, board.turn),
                            turn: !board.turn
                        });
                    });
                }
                setSelection(-1)
            }
        }
    };

    return (
        <>
            <Mouse/>

            <div
                style={{
                    color: "white",
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    fontWeight: 'bold',
                    paddingBottom: 8
                }}
            >
                <div>
                    <span style={{fontSize: 36}}>
                        MyChess-V1
                    </span>
                    <span>
                        &nbsp;by Arnav Mehra
                    </span>
                </div>
                <a
                    target="_blank"
                    href='https://github.com/arnav-mehra/MyChess'
                    style={{color: 'white', textDecoration: 'none'}}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1.5em"
                        viewBox="0 0 496 512"
                        style={{ fill: 'white', paddingBottom: 4 }}
                    >
                        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                    </svg>
                </a>
            </div>

            {/* board */}
            <div
                style={{
                    width: "calc(min(95vw, 85vh))",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 8,
                    overflow: "hidden",
                    backgroundColor: 'white'
                }}
            >
                {dimArr.map(row => 
                    <div
                        style={{
                            display: "flex",
                            width: "100%"
                        }}
                        key={row}
                    >
                        {dimArr.map(col => {
                            const isBlackSq = (row + col) % 2
                            const sq = flipped ? 63 - (row * 8 + col) : row * 8 + col;
                            const piece = board.boardStr[sq];
                            return (
                                <Square
                                    key={col}
                                    sq={sq}
                                    piece={piece}
                                    isBlackSq={isBlackSq}
                                    checkedSq={checkedSq}
                                    selection={selection}
                                    handleSelect={handleSelect}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            <Buttons
                playFirstTurn={playFirstTurn}
            />
        </>
    );
};

export default App;