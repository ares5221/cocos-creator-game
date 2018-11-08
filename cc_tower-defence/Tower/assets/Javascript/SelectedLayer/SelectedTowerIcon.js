cc.Class({
    extends: cc.Component,

    properties: {
        CastLabel:{
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    initSelectedIcon: function (game,object) {
        this.Game = game;
        this.ChooseObject = object;
        var chooseTowerIconJS = object.getComponent('ChooseTowerIcon');
        this.node.getComponent(cc.Sprite).spriteFrame = chooseTowerIconJS.getNormalSpriteFrame();
        this.CastLabel.string = chooseTowerIconJS.CastCount;
        this.CastCount = chooseTowerIconJS.CastCount;
    },
    unChooseTowerIcon : function (event,coustomData) {
        cc.log('unchooseTowerIcon');
        if(this.ChooseObject){
            this.ChooseObject.getComponent('ChooseTowerIcon').unSelected();
            this.Game.unChooseTower(this.node);
        }

        // this.node.parent.removeChild(this.node);
        // this.node.destroy();
    }


});
