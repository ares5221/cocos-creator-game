cc.Class({
    extends: cc.Component,

    properties: {

        map: {
            default:null,
            type: cc.Node,
        },
        socket: {
            default:null,
            type: cc.Node,
        },
        equip: {
            default:null,
            type: cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {
        let self = this
        var equips = cc.find("equips")
        self.node.on('mouseup', function(event){
            
            console.log("event.getButton() is " + event.getButton())
            if(event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT){
            var x = event.getLocation().x - self.map.x
            var y = event.getLocation().y - self.map.y
            var dot = self.map.getChildByName("pass_dot")
            dot.stopAllActions()
            dot.x = x
            dot.y = y
            var action1 = cc.fadeIn(0.1);
            var action2 = cc.scaleTo(0.2, 1, 1);
            var action3 = cc.scaleTo(0.2, 0.4, 0.4);
            var action4 = cc.scaleTo(0.2, 0.7, 0.7);
            var action5 = cc.fadeOut(1);

        
            var seq1 = cc.sequence(action1, action2, action3, action4, action5);

            dot.runAction(seq1)

            var json1 = {"type":"move", "x":x, "y":y}
            self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1))
            cc.find("herodesc").active = false
            }


        })
        self.node.on('mousemove', function(event){
            
            if (self.equip != null)
            {
                self.equip.x = event.getLocation().x - equips.x 
                self.equip.y = event.getLocation().y - equips.y 
            }
        })
        var sypress = false
        var listener = {
            event: cc.EventListener.KEYBOARD,
            
            onKeyPressed: function (keyCode, event) {
                if(sypress == true) return
                sypress = true
                if(keyCode == 83)
                {
                    var json1 = {"type":"move", "x":-1, "y":-1}
                    self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1))
                }
                else if(keyCode == 32)
                {
                    
                    
                    var json1 = {"type":"move", "x":-2, "y":-2}
                    self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1))
                }
            },
            onKeyReleased: function (keyCode, event) {
                sypress = false
                if(keyCode == 83)
                {

                }
                else if(keyCode == 32)
                {
                   
                    var json1 = {"type":"move", "x":-2, "y":-3}
                    self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1)) 
                }
            }
        }
        // 绑定键盘事件
        cc.eventManager.addListener(listener, this.node);


        self.node.on(cc.Node.EventType.TOUCH_START, function(event){
            // var x = event.getLocation().x - self.map.x
            // var y = event.getLocation().y- self.map.y
            // var json1 = {"type":"move", "x":x, "y":y}
            // self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1))
        })

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
