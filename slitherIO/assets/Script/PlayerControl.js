var IOGameNet = require('IOGameNet')

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
    },
    // use this for initialization
    onLoad: function () {
        this.isDoubleClick = false
        this.isHaveClick = false
        //添加触摸
        this.addTouchEvent()

        //添加碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        
        //初始化网络
        this.initNet()

    },

    //初始化网络
    initNet: function () {
        var self = this
        console.log('初始化网络:');
        //获取到链接网易云信的实例（NetEaseIM的缩写）
        IOGameNet.connect('xuhuijie', function (data) {
            console.log('登录成功：', data);

            //发送登录成功的消息
            var data = {
                x: self.node.x,
                y: self.node.y,
            }
            cc.director.GlobalEvent.emit('Net_login', data)
        })
    },

    

    //添加触摸监控
    addTouchEvent: function() {
        var dt = 0.3//双击的间隔时间


        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            cc.director.GlobalEvent.emit('moveTo', event.touch)


            //==============双击的判断===================
            if (this.isHaveClick) {
                this.isDoubleClick = true
                //console.log('双击！');
                cc.director.GlobalEvent.emit('isAddSpeedMove', true)
            }
            this.isHaveClick = true
            var action = cc.sequence(
                cc.delayTime(dt),
                cc.callFunc(function(){
                    this.isHaveClick = false
                }, this),
            )
            //==========================================
            
            action.setTag(255)
            this.node.stopActionByTag(255)
            this.node.runAction(action)
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            
            cc.director.GlobalEvent.emit('moveTo', event.touch)
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            //松开一定要恢复原速
            cc.director.GlobalEvent.emit('isAddSpeedMove', false)
        }, this)


        

    },

    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
