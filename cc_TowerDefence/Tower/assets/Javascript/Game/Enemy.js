const EnemyState = {
    Invalide: -1,
    Waiting: 1,
    Alive: 2,
    Dead: 3
}
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
        SprireFrame0: {
            default: null,
            type: cc.SpriteFrame
        },

        MoveSpeed:0,
        Animation: {
            default: null,
            type: cc.Animation
        },
        BloodProgressBar: {
            default: null,
            type: cc.Node
        },
        BloodCount: 0,
        State: EnemyState.Invalide,
        GoldCount: 0

    },

    // use this for initialization
    onLoad: function () {
        this.TotalBolldCount = this.BloodCount;
        this.setState(EnemyState.Alive);

    },
    initEnemy : function (PathObjects) {
       // this.node.convertToWorldSpace()
        //console.log('初始化敌人');
       // this.getComponent('cc.Sprite').spriteFrame = this['SprireFrame' + index];
        ///左下角位置坐标是
        this.pathIndex = 0 ;
        // this.startPos = cc.p(this.Game.node.width * -0.5,this.Game.node.height * -0.5);
        this.node.setPosition(PathObjects.children[0].getPosition());
        this.PathObjects = PathObjects;
    },
    // called every frame, uncomment this function to activate update callback
    //
    moveToTargetPos:function (targetPos) {
        var distance = cc.pDistance(this.node.getPosition(),targetPos);
       //console.log('distance = ' + distance);
        var time = distance/this.MoveSpeed;
        var action = cc.moveTo(time,targetPos);
        this.node.stopAllActions();
        this.node.runAction(action);
    },
   update: function (dt) {
        if (this.PathObjects){
            if (cc.pDistance(this.node.getPosition(),this.PathObjects.children[this.pathIndex].getPosition()) < 10){
                //cc.log('移动敌人');
                if (this.pathIndex < this.PathObjects.children.length - 1){
                    this.pathIndex ++;
                    this.moveToTargetPos(this.PathObjects.children[this.pathIndex].getPosition());
                }else {
                  //  cc.log('敌人移动结束');
                    this.Game.enemyMoveOver(this);
                }
            }

        }
        this.BloodProgressBar.getComponent(cc.ProgressBar).progress = this.BloodCount/this.TotalBolldCount;
        this.node.setLocalZOrder(Math.abs(Math.floor(1000 - this.node.getPositionY())));
   },
    hited: function (damage) {
        //cc.log('被攻击 =' + damage);
        this.BloodCount -= damage;
        if (this.BloodCount <= 0){
            this.BloodCount = 0;
            ///这只羊死了
            //删掉自己
            //this.node.parent.removeChild(this.node);
            this.Game.removeEnemy(this);
            this.setState(EnemyState.Dead);
        }
    }
    ,
    setState: function (state) {
        if (this.State === state){
            return
        }
        switch (state){
            case EnemyState.Invalide:
                break;
            case EnemyState.Waiting:
                break;
            case EnemyState.Alive:
                break;
            case EnemyState.Dead:
                break;
            default:
                break;
        }
        this.State = state;

    },
    isAlive: function () {
        if (this.State === EnemyState.Alive){
            return true;
        }
        return false;
    }
});
