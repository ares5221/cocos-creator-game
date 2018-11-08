cc.Class({
    extends: cc.Component,
    properties: {
        head: {
            default: null,
            type: cc.SpriteFrame
        },
        body: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function() {
        this.sp = this.node.addComponent(cc.Sprite);
        this.sp.spriteFrame = this.head;
    },
    // 更新坐标
    updatePos: function() {
        this.node.setPosition(this.posx * cGridSize, this.posy * cGridSize);
    },
    //设置属性
    setPro: function(px, py, isHead) {
        if (isHead) {
            this.sp.spriteFrame = this.head;
            this.node.zIndex = 1;
        } else {
            this.sp.spriteFrame = this.body;
        }
        this.posx = px;
        this.posy = py;
        this.updatePos(px, py);
    }
});