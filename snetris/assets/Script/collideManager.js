
//设置碰撞
var setCollide = function(x, y, event) {
    let k = makePosKey(x, y);
    if (event.hasOwnProperty("name")) {
        for (let key in Pos2EventMap) {
            if (Pos2EventMap[key].hasOwnProperty("name")) {
                if (Pos2EventMap[key].name == event.name) {
                    makeKeyPos(key);
                    delete Pos2EventMap[key];
                }
            }
        }
    }

    if (Pos2EventMap[k] != null) {
        if (Pos2EventMap[k].hasOwnProperty("name")) {
            if (event.name != "body0" && event.type == "body" && Pos2EventMap[k].type != "portal") {
                delete EmptyPos[k]
                Pos2EventMap[k] = event;
                return;
            }
        }
        return;
    }
    delete EmptyPos[k]
    Pos2EventMap[k] = event;
}

//获取事件，以便修改
var getEventByKey = function(x, y) {
    let k = makePosKey(x, y);
    return Pos2EventMap[k];

}

// 检测碰撞
var checkCollide = function(x, y) {
    return Pos2EventMap[makePosKey(x, y)]
}

//重置碰撞
var resetCollide = function() {
    Pos2EventMap = {};
}

//清空body节点
var resetBodyCol = function() {
    for (let key in Pos2EventMap) {
        if (Pos2EventMap[key].type == "body") {
            delete Pos2EventMap[key];
            makeKeyPos[key];
        }
    }
}


//随机算法
function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//获得空节点
var randomEmptyPos = function() {
    let keys = Object.keys(EmptyPos);
    let randomNum = getRandom(keys.length - 1, 0);
    let key = keys[randomNum];
    return EmptyPos[key];
}

// 接口
var collide = {
    setCollide: setCollide,
    checkCollide: checkCollide,
    resetCollide: resetCollide,
    randomEmptyPos: randomEmptyPos,
    resetBodyCol: resetBodyCol,
    getEventByKey: getEventByKey
}
module.exports = collide;