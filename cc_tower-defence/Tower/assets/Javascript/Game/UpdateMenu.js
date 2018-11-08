cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.node.setScale(1,0.1);
        var action = cc.scaleTo(0.1,0.6,0.6);
        this.node.runAction(action);
    },
    initMenu: function (Game,TowerBase) {
        this.TowerBase = TowerBase;
        this.Game = Game;
        ///根据中心点的位置创建两个按钮
    },
    updateListener: function () {
        this.TowerBase.updateTower();
    },
    sellEventListener: function () {
        this.TowerBase.sellTower();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
