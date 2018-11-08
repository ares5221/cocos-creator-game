import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        // SelectedLayer: {
        //     default: null,
        //     type: cc.Node
        // }
    },

    // use this for initialization
    onLoad: function () {





        // this.Label1.node.setOpacity(0);
        // this.Label2.node.setOpacity(0);
        //
        // var self = this;
        // var enterAction = function (object,cb) {
        //     var that = {};
        //     object.setScale(5,5);
        //     var action1 = cc.scaleTo(0.4,1,1);
        //     var action2 = cc.fadeTo(0.4,255);
        //     var action3 = cc.delayTime(1);
        //     object.runAction(action1);
        //     object.runAction(cc.sequence(action2,action3,cc.callFunc(function () {
        //         object.setOpacity(0);
        //         if (cb === undefined){
        //             cb();
        //         }
        //     },object)));
        //     return that;
        // }
        //
        // enterAction(this.Label1.node,function () {
        //     enterAction(self.Label2.node,function () {
        //         self.node.parent.removeChild(self.node);
        //         self.SelectedLayer.getComponent('SelectedLayer').enter();
        //     });
        // });
    },
    actionMove:function (object,pos,cb) {
        if (object.isAction === true){
            return;
        }
        object.isAction = true;
        var action = cc.moveTo(0.6,pos);
        var seq = cc.sequence(action,cc.callFunc(function () {
            if (cb){
               cb();
            }
            object.isAction = false;
        }))
        object.runAction(seq);
    },
    animationCB: function (event) {
        cc.log('animation is over');
        this.node.destroy();
        // this.SelectedLayer.getComponent('SelectedLayer').enter();
        // this.SelectedLayer.active = true;

        cc.director.loadScene('ChooseLevel');

    },
    buttonClick: function (event,customData) {
        cc.log('event' + customData);
        switch (customData){
            case 'newgame':
                this.node.getComponent(cc.Animation).play('enterLayerAnimation',0);
                this.node.getComponent(cc.Animation).on('finished',this.animationCB,this);
                break;
            case 'skipButton':
                this.node.getComponent(cc.Animation).play('enterLayerAnimation',15);
                this.node.getComponent(cc.Animation).on('finished',this.animationCB,this);
                break;
            default:
                break;
        }


    },
    adsButtonClick: function (event, coustomData) {
        switch (coustomData){
            case 'preload':
                cc.log('preload');
                global.SDKManager.preloadBanner();
                break;
            case 'show':
                cc.log('show');
                global.SDKManager.showBanner();
                break;
        }
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
