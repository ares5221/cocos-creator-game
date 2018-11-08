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
        BuildMenuBg: {
            default: null,
            type: cc.Node
        },
        SelectedIcon: {
            default: null,
            type: cc.Prefab
        }
    },
    // use this for initializatio
    onLoad: function () {
        //将IconTower绘制到建造菜单上
        ////播放动画
        this.node.setScale(1,0.1);
        var action = cc.scaleTo(0.1,0.6,0.6);
        this.node.runAction(action);

    },

    iconButtonClick: function (event,customEventData) {
        // cc.log('icon button click' + event.target.index);
        ///
        ////点钟了  event。targte。index icon///新建tower
        this.TowerBase.buildTower(event.target.index);
        this.node.destroy();


    },

    initMenu: function (Game,TowerBase) {
        this.Game = Game;
        this.TowerBase = TowerBase;
        var towerList = Game.getComponent('Game').SelectedTowerList;
        console.log('TowerIcon List=' + towerList.length);
        for (var i = 0 ; i < towerList.length ; i ++){
           var node = cc.instantiate(towerList[i]);
            node.setScale(0.8,0.8);
            this.BuildMenuBg.addChild(node);
            node.index = towerList[i].index;
            var eventListener = new cc.Component.EventHandler();
            eventListener.target = this.node;
            eventListener.component = 'BuildMenu';
            eventListener.handler = 'IconClickEvent';
            node.addComponent(cc.Button).clickEvents.push(eventListener);
        }

        this.fixIconPos();
    },
    fixIconPos : function () {
        if (this.BuildMenuBg.children.length === 1){
            this.BuildMenuBg.children[0].setPosition(cc.p(0,20));
        }else {
        for (var i = 0 ; i < this.BuildMenuBg.children.length ; i ++){
            var node = this.BuildMenuBg.children[i];
            var pos = cc.pRotateByAngle(cc.p(0,80),cc.p(0,20),i * Math.PI * 2/ this.BuildMenuBg.children.length );
            node.setPosition(pos);

        }
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    IconClickEvent: function (event,customData) {
        cc.log('tower selected' + event.target.index);
        this.TowerBase.buildTower(event.target.index);
    }
});
