var col = require("collideManager");
cc.Class({
    extends: cc.Component,

    properties: {
        fence: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function() {
        // 精灵数组
        this.fenceSpArr = [];
        // 墙壁对象池
        this.fencePool = new cc.NodePool();
        let initCount = cBound * 4;
        for (let i = 0; i < initCount; ++i) {
            let fence = cc.instantiate(this.fence); // 创建节点
            this.fencePool.put(fence); // 通过 putInPool 接口放入对象池
        };
        // 墙壁初始化
        this.fencesInit();
    },
    createFence: function(x, y) {
        let fence = null;
        if (this.fencePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            fence = this.fencePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            fence = cc.instantiate(this.fence);
        }
        fence.setPosition(x * cGridSize, y * cGridSize);
        this.fenceSpArr.push(fence);
        fence.parent = this.node; // 将生成的敌人加入节点树
    },
    fenceGenerator: function(bound, fun) {
        for (let i = -bound; i < bound + 1; i++) {
            let pos = fun(i);
            this.createFence(pos[0], pos[1]);
        }
    },
    fencesInit: function() {
        this.fenceGenerator(cBound, function(i) {
            col.setCollide(cBound, i, { type: "fence" });
            return [cBound, i];
        });
        this.fenceGenerator(cBound, function(i) {
            col.setCollide(-cBound, i, { type: "fence" });
            return [-cBound, i];
        });
        this.fenceGenerator(cBound, function(i) {
            col.setCollide(i, cBound, { type: "fence" });
            return [i, cBound];
        });
        this.fenceGenerator(cBound, function(i) {
            col.setCollide(i, -cBound, { type: "fence" });
            return [i, -cBound];
        });
    },
    // 回收
    reset: function() {
            this.node.removeAllChildren();
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});