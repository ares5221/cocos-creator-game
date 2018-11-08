var ChooseTowerState = {
    Invailde: -1,
    Waitting: 1,
    Normal: 2,
    Selected: 3
}
cc.Class({
    extends: cc.Component,
    properties: {
         NormalSpriteFrame: {
              default: null,
              type: cc.SpriteFrame
          },
         SelectedSpritedFrame: {
             default: null,
             type: cc.SpriteFrame
         },
        CastLabel: {
            default: null,
            type: cc.Label
        },
        CastCount: 0
    },

    onLoad: function () {
        this.State = ChooseTowerState.Waitting;
        this.CastLabel.string = this.CastCount;
    },
    setState: function (state) {
        if (this.State === state){
            return;
        }
        switch (state){
            case ChooseTowerState.Waitting:
                break;
            case ChooseTowerState.Normal:
                this.node.getComponent(cc.Sprite).spriteFrame = this.NormalSpriteFrame;
                break;
            case ChooseTowerState.Selected:
                this.node.getComponent(cc.Sprite).spriteFrame = this.SelectedSpritedFrame;
                break;
            default:
                break;
        }
        this.State = state;
    }

    ,
    selected: function () {
        cc.log('selected');
        this.setState(ChooseTowerState.Selected);
    },
    unSelected: function () {
        cc.log('unSelected');
        this.setState(ChooseTowerState.Normal);
    },
    getNormalSpriteFrame: function () {
        return this.NormalSpriteFrame;
    }

});
