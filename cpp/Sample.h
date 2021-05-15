#include <string>
using namespace std;

int evaluatePosition(int depth, bool turn, string boardChar);
string playEngineMove(bool turn, string boardChar);
string getLegalMoves(bool turn, string boardChar);
string makeMove(string boardChar, int from, int to, bool turn);
bool isCheck();
void setUp();
void setRandomness(int level);


// b.setBoardFen("8/pk5p/2r3p1/2pP1pP1/3p4/R2K3P/5P2/8");
// b.printBoard();

// b.turn = false;
// printMove(bestMove);
// cout << '\n' << "Nodes Evaluated: " << s.nodes << '\n';
// // cout << "Nodes Transposed: " << s.transposedNodes << '\n';
// cout << "Evaluation: " << s.eval/100.0 << '\n';
// cout << "Depth: " << depth+0 << " / " << depth + s.quiescenceDepth << '\n';
// Move bestMove = s.iterativeCall(depth);