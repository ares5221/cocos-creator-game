// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        spritesArray: {
            default: [],
            type: [cc.SpriteFrame],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.currentSpriteIndex = 0;
    },

    switchSprite() {
        this.currentSpriteIndex += 1;
        this.getComponent(cc.Sprite).spriteFrame = this.spritesArray[this.currentSpriteIndex % this.spritesArray.length];
    },

    switchSpriteTo(index) {
        this.currentSpriteIndex = index % this.spritesArray.length;
        this.getComponent(cc.Sprite).spriteFrame = this.spritesArray[this.currentSpriteIndex % this.spritesArray.length];
    }
});
