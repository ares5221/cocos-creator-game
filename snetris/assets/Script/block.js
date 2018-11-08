cc.Class({
    extends: cc.Component,

    properties: {
        blockArr: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function() {

    },
    changeTexture: function(i) {
        let fra = this.node.getComponent(cc.Sprite)
        fra.spriteFrame = this.blockArr[i];
    }
});