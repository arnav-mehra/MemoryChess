#include <vector> 
#include <cstdint>
#include <iostream>
#include <array>
#include <map>
#include <algorithm>
#include <string>
#include "MagicMoves.h"
#include "data.h"

#include "piece.h"
#include "move.h"
#include "board.h"

#include "printer.h"
#include "transposition.h"
#include "generation.h"
#include "moving.h"
#include "evaluation.h"
#include "search.h"

Board b;
int depth = 1;


void setUp() {
    initmagicmoves();
    init_tables();
}

int evaluatePosition(int depth, bool turn, string boardChar) {
    b.turn = turn;
    char bChar[64];
    for (int i=0; i<64; i++) {bChar[i] = boardChar[i];}
    b.setBoard(bChar);

    bool useTranpositionTable = true; //removed
    bool useQuiescentSearch = true;
    Search s(b, useTranpositionTable, useQuiescentSearch);
    Move bestMove = s.abNegaMaxCall(depth);

    return abs(s.getEval()) * 100000 + bestMove.fromSq * 1000 + bestMove.toSq * 10 + (s.getEval() > 0? 0 : 1);
}

string playEngineMove(bool turn, string boardChar) {
    b.turn = turn;
    char bChar[64];
    for (int i=0; i<64; i++) {bChar[i] = boardChar[i];}
    b.setBoard(bChar);

    bool useTranpositionTable = true; //removed
    bool useQuiescentSearch = true;
    Search s(b, useTranpositionTable, useQuiescentSearch);
    Move bestMove = s.abNegaMaxCall(depth);

    if (bestMove.piece == 69) { return "checkmate"; }
    else if (bestMove.piece == 70) { return "draw"; }
    else {
        b.move(bestMove);
        return b.getBoardStr();
    }
}

string getLegalMoves(bool turn, string boardChar) {
    b.turn = turn;
    char bChar[64];
    for (int i=0; i<64; i++) {bChar[i] = boardChar[i];}
    b.setBoard(bChar);

    bool useTranpositionTable = true; //removed
    bool useQuiescentSearch = true;
    Search s(b, useTranpositionTable, useQuiescentSearch);
    vector<Move> legalMoves = s.legalMoveGen();

    string moves;
    for (int i=0; i<legalMoves.size(); i++) {
        moves += to_string(legalMoves[i].fromSq) + to_string(legalMoves[i].toSq) + " ";
    }
    return moves;
}

string makeMove(string boardChar, int from, int to, bool turn) {    
    char bChar[64];
    for (int i=0; i<64; i++) {bChar[i] = boardChar[i];}
    b.setBoard(bChar);
    b.turn = turn;

    Search s(b, false, false);
    vector<Move> legalMoves = s.legalMoveGen();

    for (int i=0; i<legalMoves.size(); i++) {
        if (legalMoves[i].fromSq == from && legalMoves[i].toSq == to) {
            b.move(legalMoves[i]); break;
        }
    }
    
    return b.getBoardStr();
}


bool isCheck() {
    if (b.isCheck()) { return true; }
    b.turn = !b.turn;
    if (b.isCheck()) { 
        b.turn = !b.turn;
        return true;
    } else {
        b.turn = !b.turn;
        return false;
    }
}


void setRandomness(int level) {
    b.randomness = (5-level)*50;
    depth = level;
}