cc.Class({
    extends: cc.Component,
    
    properties: {
        xSpeed: cc.Integer,//x轴速度
        ySpeed: cc.Integer,//y轴速度
        hpDrop: cc.Integer, //掉血
        
    },

    // use this for initialization
    onLoad: function () {
       cc.director.getCollisionManager().enabled=true;
    },
    
    //碰撞检测
    onCollisionEnter: function(other,self){
        this.bulletGroup.bulletDied(self.node);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.bulletGroup.eState != D.commonInfo.gameState.start){
            return ;
        }
        this.node.x += dt*this.xSpeed;
        this.node.y += dt*this.ySpeed;
        
        if ( this.node.y> this.node.parent.height){
            this.bulletGroup.bulletDied(this.node);
        }
    },
    
});
