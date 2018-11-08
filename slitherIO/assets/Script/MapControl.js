var Helpers = require('Helpers')

cc.Class({
    extends: cc.Component,

    properties: {
        foodPic:{
            default: null,
            type: cc.SpriteFrame,
        },
        addFoodDt: 2,
        foodPrefab: {
            default: null,
            type: cc.Prefab,
        },
        canvas: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.foodPool = new cc.NodePool('foodPool');

        this.addRandomFood()
        this.addScaleControl()

        

        //监听来自食物发出的尖叫（食物通知地图让地图来用缓存池管理）
        cc.director.GlobalEvent.on('eatAFood', function (data) {
            var node = data
            this.foodPool.put(node)
        }, this)
    },

    //随机添加食物，不由服务器管，每一个在线的玩家都主动添加食物，这样在线玩家越多，食物也就会越多
    addRandomFood: function () {
        var action = cc.repeatForever(cc.sequence(
                cc.delayTime(this.addFoodDt),
                cc.callFunc(function(){
                    this.addFood()
                }, this),
        ))
        this.node.runAction(action)
    },

    //添加食物实现
    addFood: function () {
        var maxFoodCount = cc.sys.isMobile ? 100 : 200

        if (this.node.children.length > maxFoodCount) {
            // console.log('数量已经过多，不加食物');
            return
        }


        var pad = 20
        var minX = pad
        var maxX = this.node.width - pad
        var minY = pad
        var maxY = this.node.height - pad

        var x = Helpers.getRandom(minX, maxX)
        var y = Helpers.getRandom(minY, maxY)


        var node
        if (this.foodPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.foodPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.foodPrefab);
        }
        node.x = x
        node.y = y
        node.parent = this.node
    },

    //添加放大缩小操作
    addScaleControl: function () {

        if (cc.sys.isMobile) {
            //添加多点触摸事件监听器
            this.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                //console.log('手机添加', event);
                var touches = event.getTouches();
                if (touches.length >= 2) {
                    console.log('手机添加touches:', touches)
                    var touch1 = touches[0], touch2 = touches[1];
                    var delta1 = touch1.getDelta(), delta2 = touch2.getDelta();
                    var touchPoint1 = this.node.convertToNodeSpaceAR(touch1.getLocation());
                    var touchPoint2 = this.node.convertToNodeSpaceAR(touch2.getLocation());
                    //缩放
                    var distance = cc.pSub(touchPoint1, touchPoint2);
                    var delta = cc.pSub(delta1, delta2);
                    var scale = 1;
                    if (Math.abs(distance.x) > Math.abs(distance.y)) {
                        scale = (distance.x + delta.x) / distance.x * this.node.scale;
                    }
                    else {
                        scale = (distance.y + delta.y) / distance.y * this.node.scale;
                    }

                    //范围限制
                   var maxS = 1
                   var minS = 1 / cc.director.Player.node.scale
                   this.node.scale = cc.clampf(scale, minS, maxS)
                }
            }, this);
        } else {
            //添加鼠标滚轮的操作
            var listener = {
                event: cc.EventListener.MOUSE,
                onMouseScroll: function (event) {
                   // cc.log('Mouse Scroll this: ', event.currentTarget);
                   if (event.getScrollY() > 0) {    
                        event.currentTarget.scale += 0.01
                   }
                   else{
                        event.currentTarget.scale -= 0.01
                   }
                   //范围限制
                   var maxS = 1
                   var minS = 1 / cc.director.Player.node.scale
                   event.currentTarget.scale = cc.clampf(event.currentTarget.scale, minS, maxS)
                },
            }
            cc.eventManager.addListener(listener, this.node);
        }
        

    },


    // update: function (dt) {
    //     // console.log('大小:', this.node.x, this.node.y);
    // },

});
