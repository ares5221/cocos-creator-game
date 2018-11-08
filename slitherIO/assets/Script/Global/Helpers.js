if (CC_JSB && cc.runtime) {
    // fix cocos-creator/fireball#3578
    cc.LoaderLayer.setUseDefaultSource(false);
    cc.Dialog.setUseDefaultSource(false);

    console.log('runG');
}

// Returns a random integer between min (included) and max (excluded)
function getRandom(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

function getRandomColor() {
    var colorList = [
        [255, 235, 148],
        [204, 225, 152],
        [151, 206, 162],
        [131, 204, 210],
        [129, 200, 237],
        [116, 181, 228],
        [164, 171, 214],
        [207, 167, 205],
        [244, 180, 208],
        [242, 156, 159],
        [245, 177, 153],
        [250, 205, 137],
        [187, 188, 222],
        [254, 229, 157],
        [237, 188, 214],
        [221, 231, 141],
        [163, 214, 202],
        [245, 177, 170],
    ]

    return colorList[getRandom(0, colorList.length - 1)]
}

//变大的action
function runScaleAction(node, scale) {
    var action = cc.scaleTo(0.1, scale)
    action.setTag(600)
    node.stopActionByTag(600)
    node.runAction(action)
}

module.exports = {
	getRandom: getRandom,
	getRandomColor: getRandomColor,
    runScaleAction: runScaleAction,
    FoodTag:999,
    MyHeadTag: 998,
};
