
cc.Class({
    extends: cc.Component,

    properties:()=> ({
        blowupani: {
            default: null,
            type:cc.Prefab,
            tooltip: '爆炸动画',
        },
        
        gameOverClip: cc.AudioClip,
        main: {
            default: null,
            type: require('main'),
        },
        bulletGroup: {
            default: null,
            type: require('bulletGroup'),
        }
    }),
    
    // use this for initialization
    onLoad: function () {
        this.eState = D.commonInfo.gameState.none;
        cc.director.getCollisionManager().enabled=true;
        this.onDrag();
        
    },

    //添加拖动监听
    onDrag: function(){
        this.node.on('touchmove', this.dragMove, this);
    },
    //去掉拖动监听
    offDrag: function(){ 
         this.node.off('touchmove', this.dragMove, this);
    },
    //拖动
    dragMove: function(event){ 
        var locationv = event.getLocation();
        var location = this.node.parent.convertToNodeSpaceAR(locationv);
        //飞机不移出屏幕 
        var minX = -this.node.parent.width/2+this.node.width/2;
        var maxX = -minX;
        var minY = -this.node.parent.height/2+this.node.height/2;
        var maxY = -minY;
        if (location.x< minX){
            location.x = minX;
        }
        if (location.x>maxX){
            location.x = maxX;
        }
        if (location.y< minY){
            location.y = minY;
        }
        if (location.y> maxY){
            location.y = maxY;
        }
        this.node.setPosition(location);
    },
    //碰撞监测
    onCollisionEnter: function(other,self) {
        if (other.node.group == 'ufo'){
            if (other.node.name == 'ufoBullet'){
                this.bulletGroup.changeBullet(other.node.name);
            } else if (other.node.name == 'ufoBomb'){
                this.main.getUfoBomb();
            }
        } else if (other.node.group == 'enemy'){
            //播放动画
            var po = this.node.getPosition();
            var blowup = cc.instantiate(this.blowupani);
            this.node.parent.addChild(blowup);
            blowup.setPosition(po);
            var animation = blowup.getComponent(cc.Animation);
            animation.on('finished',  this.onFinished, blowup);
            //播放音效
            cc.audioEngine.playEffect(this.gameOverClip, false);
            //清除节点
            this.node.destroy();
            //更新分数 
            this.main.gameOver();   
        } else {
            return false;
        }
        
    },
    
    onFinished: function(event) { //动画结束后
        this.destroy();
        //cc.director.pause();
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
