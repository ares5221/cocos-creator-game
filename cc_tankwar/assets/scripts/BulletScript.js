var TankType = require("TankData").tankType;

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
        speed: 20

    },

    // use this for initialization
    onLoad: function () {
        this._cityCtrl = cc.find("/CityScript").getComponent("CityScript");
    },

    //对象池get获取对象是会调用此方法
    reuse: function (bulletPool) {
        this.bulletPool = bulletPool; // get 中传入的子弹对象池
    },

    //子弹移动
    bulletMove: function () {
        //偏移
        var angle = 90 - this.node.rotation;
        if(angle==0 || angle==180 || angle==90){
            this.offset = cc.v2(Math.floor(Math.cos(Math.PI/180*angle)), 
                                Math.floor(Math.sin(Math.PI/180*angle)));
        }else if(angle==270){
            this.offset = cc.v2(Math.ceil(Math.cos(Math.PI/180*angle)),
                                Math.floor(Math.sin(Math.PI/180*angle)));
        }else {
            this.offset = cc.v2(Math.cos(Math.PI/180*angle),
                                Math.sin(Math.PI/180*angle));
        }
    },

    //子弹爆炸
    bulletBoom: function () {
        this.node.parent = null;
        this.bulletPool.put(this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //移动
        this.node.x += this.offset.x*this.speed*dt;
        this.node.y += this.offset.y*this.speed*dt;

        //检测碰撞
        var rect = this.node.getBoundingBox();
        if(this._cityCtrl.collisionTest(rect, true)
            || this.collisionTank(rect)){
            //子弹爆炸
            this.bulletBoom();
        }

    },

    //判断与坦克碰撞
    collisionTank: function(rect) {
        for(var i=0; i<cc.gameData.tankList.length; i++){
            var tank = cc.gameData.tankList[i]
            var tankCtrl = tank.getComponent("TankScript");
            if(tankCtrl.team == this.node.tag || tankCtrl.die){
                //同一队不互相伤害
                continue;
            }
            var boundingBox = tank.getBoundingBox();
            if(cc.rectIntersectsRect(rect, boundingBox)){
                if(--tankCtrl.blood <= 0){
                    tankCtrl.boom();
                }
                return true;
            }
        }
        return false;
    },

});
