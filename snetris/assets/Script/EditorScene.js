var col = require("collideManager");
cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        let me = this;
        me.curPos = [0, 0];
        me.curBk = 0;
        me.blockArr = [];
        me.mapData = {};
        me.blockPool = new cc.NodePool();
        let initCount = 10;
        for (let i = 0; i < initCount; ++i) {
            let bp = cc.instantiate(me.blockPrefab); // 创建节点
            me.blockPool.put(bp); // 通过 putInPool 接口放入对象池
        };
        me.block = me.blockPool.get();
        me.block.parent = this.node;
        me.bk = me.block.getComponent("block");

    },
    createBlock: function() {
        let bp = null;
        if (this.blockPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bp = this.blockPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bp = cc.instantiate(this.blockPrefab);

        }
        return bp;
    },
    destroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    setBlockPos: function() {
        let me = this;
        me.block.setPosition(cGridSize * me.curPos[0], cGridSize * me.curPos[1]);
    },
    setBlockTexture: function() {
        let me = this;
        me.bk.changeTexture(me.curBk)
    },
    checkPos: function() {
        if (this.curPos[0] == 0 && this.curPos[1] == 0) {
            return false
        }
        return true;
    },
    onKeyDown: function(event) {
        let me = this;
        let key = makePosKey(me.curPos[0], me.curPos[1]);
        switch (event.keyCode) {
            case cc.KEY.left:
                if (!col.checkCollide(me.curPos[0] - 1, me.curPos[1])) {
                    me.curPos[0] -= 1;
                    me.setBlockPos();
                }
                break;
            case cc.KEY.right:
                if (!col.checkCollide(me.curPos[0] + 1, me.curPos[1])) {
                    me.curPos[0] += 1;
                    me.setBlockPos();
                }
                break;
            case cc.KEY.up:
                if (!col.checkCollide(me.curPos[0], me.curPos[1] + 1)) {
                    me.curPos[1] += 1;
                    me.setBlockPos();
                }
                break;
            case cc.KEY.down:
                if (!col.checkCollide(me.curPos[0], me.curPos[1] - 1)) {
                    me.curPos[1] -= 1;
                    me.setBlockPos();
                }
                break;
            case cc.KEY.num1:
                me.curBk -= 1;
                if (me.curBk < 0) {
                    me.curBk = blockCount - 1;
                }
                me.setBlockTexture();
                break;
            case cc.KEY.num2:
                me.curBk += 1;
                if (me.curBk >= blockCount) {
                    me.curBk = 0;
                }
                me.setBlockTexture();
                break;
            case cc.KEY.num3:
                let da1 = "";
                for (key in me.mapData) {
                    let jsonObj = {
                        kind: me.mapData[key][0],
                        x: me.mapData[key][1][0],
                        y: me.mapData[key][1][1]
                    }
                    let jsonStr = JSON.stringify(jsonObj)
                    da1 = da1 + jsonStr + "+";
                }
                da1 = da1.substr(0, da1.length - 1);
                cc.sys.localStorage.setItem("mapData", da1);
                break;
            case cc.KEY.num0:

                if (!me.mapData.hasOwnProperty(key) && me.checkPos()) {
                    let bp = me.createBlock();
                    bp.setPosition(me.curPos[0] * cGridSize, me.curPos[1] * cGridSize);
                    bp.getComponent("block").changeTexture(me.curBk);
                    bp.parent = this.node;
                    me.mapData[key] = [me.curBk, me.curPos.slice(0, 2)];
                    console.log(me.mapData);
                    me.blockArr[key] = bp;
                }
                break;
            case cc.KEY.numdel:
                if (me.mapData.hasOwnProperty(key)) {
                    delete me.mapData[key];
                    me.blockPool.put(me.blockArr[key]);
                    delete me.blockArr[key];

                }
                //me.blockArr[0].getComponent("block").changeTexture(me.curBk);
                break;
        }
    },

});