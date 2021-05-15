#include <emscripten.h>
#include <emscripten/bind.h>
#include "Sample.h"


EMSCRIPTEN_BINDINGS(sample) {
    emscripten::function("evalPosition", &evaluatePosition);
    emscripten::function("playEngMove", &playEngineMove);
    emscripten::function("getLegals", &getLegalMoves);
    emscripten::function("setUp", &setUp);
    emscripten::function("makeMove", &makeMove);
    emscripten::function("isCheck", &isCheck);
    emscripten::function("setLevel", &setRandomness);
}
