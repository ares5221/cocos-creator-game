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
        Damage: 0,
        HitRange:0,
        MoveSpeed: 0,
    },

    // use this for initialization
    onLoad: function () {

    },
    moveEndPosition: function (endPos) {
        var distance = cc.pDistance(this.node.getPosition(),endPos);
        var direction = cc.pNormalize(cc.pSub(this.node.getPosition(),endPos));
        var middlePos = cc.pAdd(this.node.getPosition(),cc.pMult(direction,distance * -0.5));
        middlePos.y += 100;
        var time = distance/this.MoveSpeed;
        // var action = cc.moveTo(time,middlePos);
        var ep = cc.p(endPos.x + Math.random() * 50 - 25, endPos.y + Math.random() * 50 -25);

        var action = cc.bezierTo(time,[this.node.getPosition(),middlePos,ep]);
        action.easing(cc.easeIn(0.5));
        var self = this;
        //中间点

        var seq = cc.sequence(action, cc.callFunc(function () {
            // self.node.destroy();
            self.explodeBomb();
        }));
        this.node.runAction(seq);
        this.node.setScale(0.3,0.3);
        var action1 = cc.scaleTo(time,0.37,0.37);
        this.node.runAction(action1);
    },
    explodeBomb: function () {
        cc.log('bomb explode');
        // this.node.parent.removeChild(this.node);
        var enemyList = this.Game.getComponent('Game').Enemys;
        for(var i = 0 ; i < enemyList.length ; i ++){
            var distance = cc.pDistance(this.node.getPosition(),enemyList[i].getPosition());
            // cc.log('distance' + distance);
            if (distance < this.HitRange){
                //在攻击范围之内
                enemyList[i].getComponent('Enemy').hited(this.Damage);
            }
        }
        var self = this;
        var action1 = cc.scaleTo(0.2,3,3);
        var action2 = cc.fadeTo(0.18,0);
        var seq = cc.sequence(action1,cc.callFunc(function () {
            self.node.parent.removeChild(this.node);
        }));
        this.node.runAction(action2);
        this.node.runAction(seq);


    }
});
