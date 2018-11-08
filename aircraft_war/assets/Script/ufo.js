cc.Class({
    extends: cc.Component,

    properties: {
        xMinSpeed: { //x轴最小速度
            default:0,
            type:cc.Integer
        },
        xMaxSpeed: {//x轴最大速度
            default:0,
            type:cc.Integer
        },
        yMinSpeed: {
            default:0,
            type:cc.Integer
        },//y轴最小速度
        
        yMaxSpeed: { //y轴最大速度
            default:0,
            type:cc.Integer
        },
        getUfoClip: cc.AudioClip,
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getCollisionManager().enabled=true;
        
        this.xSpeed = Math.random()*(this.xMaxSpeed-this.xMinSpeed) + this.xMinSpeed;
        this.ySpeed = cc.random0To1()*(this.yMaxSpeed-this.yMinSpeed) + this.yMinSpeed;
        this.ufoGroup = this.node.parent.getComponent('ufoGroup');
    },

    //碰撞检测
    onCollisionEnter: function(other,self){
        this.node.destroy();
        //D.game.ufoBomb();
        cc.audioEngine.playEffect(this.getUfoClip, false);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.ufoGroup.eState != D.commonInfo.gameState.start){
            return ;
        }
        this.node.x += dt*this.xSpeed;
        this.node.y += dt*this.ySpeed;
        //出屏幕后
        if (this.node.y < -this.node.parent.height/2){
            this.ufoGroup.ufoDied(this.node);
        }
    },
});
