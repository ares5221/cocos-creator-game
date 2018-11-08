cc.Class({
    extends: cc.Component,
// test git
    properties: {



    },

  

    // use this for initialization
    onLoad: function () {
        let self = this
        this.swallowTouches = true



        this.node.on('mouseleave', function(event){
                var itemdesc = cc.find("hpdesc")
                itemdesc.active = false
        
        })

      

        this.node.on('mousemove', function(event){
                var itemdesc = cc.find("hpdesc")
                itemdesc.x = 200
                itemdesc.y = this.y + this.parent.y -30
                itemdesc.active = true
                if(this.name == "hit")
                {
                    itemdesc.getChildByName("desc").getComponent("cc.Label").string = "攻击"
                }
                else if(this.name == "defsprite")
                {
                    itemdesc.getChildByName("desc").getComponent("cc.Label").string = "护甲"
                }
                else
                {
                    itemdesc.getChildByName("desc").getComponent("cc.Label").string = "生命"
                }

        })




        // self.node.on(cc.Node.EventType.TOUCH_START, function(event){
        //     var x = event.getLocation().x - self.map.x
        //     var y = event.getLocation().y- self.map.y
        //     var json1 = {"type":"move", "x":x, "y":y}
        //     self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1))
        // })

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //     if(this.down == false) return
    //     var node = this.pressnode
    //     if(node == null) return


    // },
});
