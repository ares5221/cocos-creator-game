cc.Class({
    extends: cc.Component,

    properties: {
        map:{
            default:null,
            type:cc.Node,
        },
        itemlist: {
            default:null,
            type: cc.Node,
        },
        socket: {
            default:null,
            type: cc.Node,
        },
        uid:0,
        maptype:"equip",
        hp:0,
        attr:0,
        def:0,
        min:0,
        str:0,
        xixue:0,
        baoji:0,
        shanbi:0,
        yisu:0,
        gongsu:0,
        desc:"",
        heroname:"",
        lv:1


        


    },



    setdesc: function (itemdesc) {
        var name = itemdesc.getChildByName("namelabel")
        var shuxing = itemdesc.getChildByName("shuxing")
        var desc = itemdesc.getChildByName("desc")
        name.getComponent("cc.Label").string = this.heroname + "(" + this.lv + ")"
        desc.getComponent("cc.Label").string = this.desc+" "
        var str = ""


        this.hp !== 0 ?str=str+"增加" +this.hp+"点生命\n":str=str
        this.attr !== 0 ?str=str+"增加" +this.attr+"攻击\n":str=str
        this.def !== 0 ?str=str+"增加" +this.def+"护甲\n":str=str
        this.min !== 0 ?str=str+"增加" +this.min+"敏捷\n":str=str
        this.str !== 0 ?str=str+"增加" +this.str+"力量\n":str=str
        this.xixue !== 0 ?str=str+"增加" +this.xixue+"吸血\n":str=str
        this.baoji !== 0 ?str=str+"增加" +this.baoji+"暴击\n":str=str
        this.shanbi !== 0 ?str=str+"增加" +this.shanbi+"闪避\n":str=str
        this.yisu !== 0 ?str=str+"增加" +this.yisu+"移动速度\n":str=str
        this.gongsu !== 0 ?str=str+"增加" +this.gongsu+"攻击速度\n":str=str
        shuxing.getComponent("cc.Label").string = str
        desc.y = shuxing.y - shuxing.height 
        
        
    },

    // use this for initialization
    onLoad: function () {
        let self = this
        self.swallowTouches = true
        this.equipname = ""
        this.map = cc.find("map4")
        this.socket = this.map.getChildByName("web")

        
        this.node.on('mouseup', function(event){
            if(event.getButton() != cc.Event.EventMouse.BUTTON_RIGHT) return
            if(this.down == false) return
            this.down = false
            this.parent = null
            var node = self.getequiphold(event.getLocation().x, event.getLocation().y)
            if(node == null)
            {
                console.log("add to map")
                var map = cc.find("map4")
                this.parent = map.getChildByName("itemlist")
                this.x = event.getLocation().x - map.x
                this.y = event.getLocation().y - map.y
                this.runAction(cc.scaleTo(0.1, 0.5,0.5))
                this.maptype = "item" 
            }
            else
            {
                 console.log("add to equip")
                this.parent = node
                this.x = 0
                this.y = 0
                this.runAction(cc.scaleTo(0.1, 1,1))
                this.maptype = "equip"
            }

            var map = cc.find("map4")
            var uid = map.getComponent("map").get_main_hero_id()
            var node = map.getComponent("map").get_role_by_id(uid)
            node.getComponent("global").addequip(self.uid)
        })

        this.node.on('mouseleave', function(event){
            if(this.down == true) 
            {
            this.down = false
            this.parent = null
            var node = self.getequiphold(event.getLocation().x, event.getLocation().y)
            
            if(node == null)
            {
                console.log("add to map")
                var map = cc.find("map4")
                this.parent = map.getChildByName("itemlist")
                this.x = event.getLocation().x - map.x
                this.y = event.getLocation().y - map.y
                this.runAction(cc.scaleTo(0.1, 0.5,0.5))
                this.maptype = "item" 
            }
            else
            {
                this.parent = node
                this.x = 0
                this.y = 0
                this.runAction(cc.scaleTo(0.1, 1,1))
                this.maptype = "equip"
            }

        }
        else
        {
                var itemdesc = cc.find("itemdesc")

                itemdesc.active = false
        }
        })

        this.node.on('mousedown', function(event){
            if(event.getButton() != cc.Event.EventMouse.BUTTON_RIGHT) return
            console.log("maptype is " + this.maptype)
            var equips = cc.find("equips")
            this.parent = null
            this.parent = equips
            this.x = event.getLocation().x - equips.x 
            this.y = event.getLocation().y - equips.y 
            this.down = true
            this.runAction(cc.scaleTo(0.1, 0.8,0.8))


            // if (this.maptype == "item")
            // {
            //     this.down = true
            //     this.xd = event.getLocation().x - this.x
            //     this.xy = event.getLocation().y - this.y
            //     this.runAction(cc.scaleTo(0.1, 0.8,0.8))
            // }
            // else
            // {
            //     this.down = true
            //     var lx = event.getLocation().x - this.parent.x - this.parent.parent.x
            //     var ly = event.getLocation().y - this.parent.y - this.parent.parent.y
            //     this.xd = lx 
            //     this.yd = ly 
            //     // var x = event.getLocation().x - self.map.x
            //     // var y = event.getLocation().y - self.map.y
            //     this.runAction(cc.scaleTo(0.1, 0.8,0.8))
            // }


        })

        this.node.on('mousemove', function(event){
            if (this.down == true)
            {
            var equips = cc.find("equips")
            this.x = event.getLocation().x - equips.x 
            this.y = event.getLocation().y - equips.y 
                // if (this.maptype == "item")
                // {
                //     var map = cc.find("map4")
                //     this.parent = map.getChildByName("itemlist")
                //     this.x = event.getLocation().x - map.x
                //     this.y = event.getLocation().y - map.y

                // }
                // else
                // {
                //     var lx = event.getLocation().x 
                //     var ly = event.getLocation().y 
                //     this.x = lx - this.parent.x - this.parent.parent.x - this.xd
                //     this.y = ly - this.parent.y - this.parent.parent.y - this.yd
                // }


            }
            else{
                var itemdesc = cc.find("itemdesc")
                self.setdesc(itemdesc)
                itemdesc.x = this.x + this.parent.x + this.parent.parent.x + 75
                //itemdesc.y = this.y + this.parent.y + this.parent.parent.y 
                itemdesc.active = true
            }

        })




        // self.node.on(cc.Node.EventType.TOUCH_START, function(event){
        //     var x = event.getLocation().x - self.map.x
        //     var y = event.getLocation().y- self.map.y
        //     var json1 = {"type":"move", "x":x, "y":y}
        //     self.socket.getComponent("socket_l").sendmsg(JSON.stringify(json1))
        // })

    },



    setattr: function (uid) {
        uid = parseInt(uid)
        var confmod = require("equipconf")
        var equipconf = confmod[uid]
        console.log(equipconf)
        for (var prop in equipconf )
        {
            this[prop] = equipconf[prop]
        } 
        // if (uid.indexOf("204") != -1)
        // {
        //    this.min = 16,
        //    this.gongsu = 15,
        //    this.yisu = 10,
        //    this.equipname = "单刀"
        //    this.desc = "性价比:NO.1"
        // }
        // else if(uid.indexOf("143")!= -1)
        // {
        //     this.yisu = 50,
        //     this.equipname = "耐克"
        //     this.desc = "酱油的神装"
        // }
        // else if(uid.indexOf("191")!= -1)
        // {
        //     this.yisu = 55,
        //     this.attr = 24,
        //     this.equipname = "相位鞋"
        //     this.desc = "高手才懂"
        // }
        // else if(uid.indexOf("197")!= -1)
        // {
        //     this.xixue = 17,
        //     this.equipname = "疯脸"
        //     this.desc = "发起了疯了队友也杀"
        // }
        
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.equipname == "")
        {
            this.setattr(this.uid)
        }


    },
});
