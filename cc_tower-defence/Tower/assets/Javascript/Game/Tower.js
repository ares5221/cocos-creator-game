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
       TowerSpriteFrames: {
           default: [],
           type: cc.SpriteFrame
       },
        Range: 0,
        BuildCost: 0,
        UpdateCostRate: 0,
        SellRate: 0,
        Bullet: {
            default: null,
            type: cc.Prefab
        },
        HitRate: 0,
        AttackSpeed: 0,

    },

    onLoad: function () {
        this.target = undefined;
        this.nowTime = 0;
    },
    AttackEnemy: function (dt) {
        if (this.target){
            var distance = cc.pDistance(this.target.getPosition(),this.node.getPosition());
            if (distance < this.Range){
                ///计算出，tower与敌人之间的夹角
                var angle = cc.pAngleSigned(cc.p(0,1),cc.pSub(this.node.getPosition(),this.target.getPosition()));
                var radio = angle * 180 / Math.PI -90;
                // cc.log('angle = ' + angle);
                // cc.log('radio = ' + radio);
                var index = Math.floor(radio / 30);
                if (index < 0){
                    index += 12;
                }else {

                }
                // cc.log('index = ' + index);
                this.getComponent(cc.Sprite).spriteFrame = this.TowerSpriteFrames[index];

            }else {
                this.target = undefined;
                return;
                //敌人超出攻击范围了
            }



            if (this.nowTime > this.AttackSpeed){
                this.nowTime = 0;
                var fixPos = this.node.getPosition();
                fixPos.y += 45;
                var direction = cc.pNormalize(cc.pSub(fixPos,this.target.getPosition()));
                var startPos = cc.pAdd(fixPos,cc.pMult(direction,-10));
                var bullet = cc.instantiate(this.Bullet);
                bullet.getComponent('Bullet').Game = this.Game;
                this.Game.getComponent('Game').GameLayer.addChild(bullet);
                bullet.setPosition(startPos);
                bullet.getComponent('Bullet').moveEndPosition(this.target.getPosition());
            }else {
                this.nowTime += dt * 1000;
               // cc.log('this.nowTime = ' + this.nowTime);
            }
            if (this.target.getComponent('Enemy').isAlive()){

            }else {
                this.target = undefined;
            }







        }
    },
    update: function (dt) {
        //找到最近的tower
        ///根据敌人的位置，旋转tower的方向，首先找到离Tower最近的敌人的位置
        if (this.target === undefined){
            ///在敌人为空的情况下,寻找敌人
            var enemys = this.Game.getComponent('Game').Enemys;
            var minDistance = 10000;
            for (var i = 0 ; i < enemys.length ; i ++){
                var distance = cc.pDistance(enemys[i].getPosition(),this.node.getPosition());
                if (distance < minDistance && enemys[i].getComponent('Enemy').isAlive()){
                    minDistance = distance;
                    this.target = enemys[i];
                    ///找到了一个敌人了
                    // console.log('找到了一个敌人');
                }
            }
        }
        this.AttackEnemy(dt);


    }
});
