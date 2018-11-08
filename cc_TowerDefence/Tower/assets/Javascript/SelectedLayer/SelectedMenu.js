import global from './../global'
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
        let  self = this;
        global.EventController.on('useTowerWithInfo',function (info) {
            self.UseTowerWithInfo(info);
        });

    },
    UseTowerWithInfo: function (info) {
        cc.log('UserTowerWithInfo' + JSON.stringify(info));
        // Canvas/selectedLayer/uiLayer/LeftList/view/content/icon_tower_0/icon_tower_0
        let node = cc.find('Canvas/selectedLayer/uiLayer/LeftList/view/content/icon_tower_'+ info.towerIndex +'/icon_tower_' + info.towerIndex);
        let newNode = cc.instantiate(node);
        newNode.parent = this.node;
        newNode.setPosition(0,0);

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
