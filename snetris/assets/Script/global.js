var cGridSize = 32;
var cBound = 8;
var blockCount = 3;
var Pos2EventMap = {}

//随机新算法部分
var EmptyPos = {};
for (var i = 1 - cBound; i < cBound - 1; i++) {
    for (var j = 1 - cBound; j < cBound - 1; j++) {
        EmptyPos[i + "," + j] = [i, j];
    }
}

function Vector2Dir(x, y) {
    if (Math.abs(x) > Math.abs(y)) {
        if (x < 0) {
            return "left"
        } else {
            return "right"
        }
    } else {
        if (y < 0) {
            return "down"
        } else {
            return "up"
        }
    }
}
//添加空闲
var makeKeyPos = function(key) {
    var pos = key.split(",");
    var x = parseInt(pos[0]);
    var y = parseInt(pos[1])
    EmptyPos[key] = [x, y];
}

// 生成索引
var makePosKey = function(x, y) {
    return x + "," + y;
}