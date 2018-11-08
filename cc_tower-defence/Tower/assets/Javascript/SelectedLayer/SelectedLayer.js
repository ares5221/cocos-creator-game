import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {

        Game: {
            default: null,
            type: cc.Node
        },
        TowerMenuBg: {
            default: null,
            type: cc.Node
        },
        LeftList: {
            default: null,
            type: cc.Node
        },
        Canvas: {
            default: null,
            type: cc.Canvas
        },
        StartButton: {
            default: null,
            type: cc.Node
        },
        UILayer: {
            default: null,
            type: cc.Node
        },
        SelectedTowerIcon: {
            default: null,
            type: cc.Prefab
        },
        TowerInformation: {
            default: null,
            type: cc.Prefab
        }

    },

    // use this for initialization
    onLoad: function () {
        this.MenuItem = {};
        this.getComponent(cc.Animation).play('selectedLayeAniamtion',0);
        this.GoldCountLabel = cc.find('Canvas/selectedLayer/goldLabel_bg/Label').getComponent(cc.Label);


        global.EventController.on('useTowerWithInfo',this.UseTowerWithInfo);

    },
    UseTowerWithInfo: function (info) {
      cc.log('info=' + JSON.stringify(info));
    },
    update: function (dt) {
        this.GoldCountLabel.string = global.playerData.GoldCount;
    },



    chooseTower : function (event,index) {
        cc.log('choose tower' + index);
        event.target.getComponent('ChooseTowerIcon').selected();
        this.pushItemInMenu(event.target,index);
    },
    unChooseTower: function (object) {
        this.MenuItem[object.index] = undefined;
        this.TowerMenuBg.removeChild(object);
        this.fixIconPos();
    },
    pushItemInMenu: function (object,index) {
        if (this.MenuItem[index] === undefined){
            cc.log('push item in menu bg');
            var node = cc.instantiate(this.SelectedTowerIcon);
            node.setPosition(cc.p(0,0));
            if (node.getComponent('SelectedTowerIcon') != undefined){
               node.getComponent('SelectedTowerIcon').initSelectedIcon(this,object);
                node.index = index;
                this.TowerMenuBg.addChild(node);
                this.MenuItem[index] = node;
            }else {
                console.log('can not find SelectedTowerIcon');
            }



        }

        this.fixIconPos();

    },
    startGame: function () {
        // var MoveAction =
        cc.log('start button');
        // var self = this;
        // var action = cc.moveBy(0.3,0,this.Canvas.node.height);
        // var seq = cc.sequence(action,cc.callFunc(function () {
        //     var a = cc.fadeTo(0.6,0);
        //     var s = cc.sequence(a,cc.callFunc(function () {
        //         cc.log('start game');
        //         self.node.parent.removeChild(self.node);
        //         self.Game.getComponent('Game').startGame(self.TowerMenuBg.children);
        //     }));
        // }))
        // this.UILayer.runAction(seq);
        this.getComponent(cc.Animation).play('selectedLayerAnimationExit',1.5);
    },
    fixIconPos : function () {
        cc.log('TowerMenuBg.length=' + this.TowerMenuBg.children.length)
        if (this.TowerMenuBg.children.length === 0){
            this.StartButton.active = false;
        }else {
            this.StartButton.active = true;
        }
        for (var i = 0 ; i < this.TowerMenuBg.children.length ; i ++){
            var node = this.TowerMenuBg.children[i];
            var pos = cc.pRotateByAngle(cc.p(0,80),cc.p(0,20),i * Math.PI * 2/ this.TowerMenuBg.children.length );
            // node.setPosition(pos);
            node.stopAllActions();
            var action = cc.moveTo(0.2,pos);
            node.runAction(action);
        }
    },
    DisPlayTowerInformation: function (object,coustomData) {
        cc.log('coustom data icon button=' + coustomData);
        this.CloseDisPlayTowerInformation();
        this.towerInformation = cc.instantiate(this.TowerInformation);
        this.towerInformation.getComponent('towerInformation').showTowerInformationAnimation(coustomData);
        this.node.addChild(this.towerInformation);
    },
    CloseDisPlayTowerInformation: function (event,customData) {
        if(this.towerInformation){
            this.node.removeChild(this.towerInformation);
        }
    }
});
