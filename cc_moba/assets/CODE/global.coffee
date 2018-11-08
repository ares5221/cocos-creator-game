cc.Class {
    extends: cc.Component

    properties: {
        # foo:
        #   default: null
        #   type: cc
        #   serializable: true # [optional], default is true
        #   visible: true      # [optional], default is true
        #   displayName: 'Foo' # [optional], default is property name
        #   readonly: false    # [optional], default is false
        actiontype : "1"
        actionstatus: null
        direct : "1"
        speed : 0.5
        arf:0
        hittarget :null
        oldaction:null
        uid:0
        lasttime:0
        namestr:""
        hittick: 0

        socket: 
            default:null,
            type: cc.Node,

        smallpoint: 
            default:null,
            type: cc.Node,
            
        map: 
            default:null,
            type: cc.Node,

       hurtlabel:
            default:null,
            type: cc.Node,

        namelabel: 
            default:null,
            type: cc.Node,

        actornode: 
            default:null,
            type: cc.Node,

        hpbar:
            default:null
            type:cc.Node
        attrba:
            default:null
            type:cc.Node
        expbar:
            default:null
            type:cc.Node

        lvlab:
            default:null
            type:cc.Node

        cy1:
            default:null
            type:cc.Node

        hp:606
        hpmax:606
        attackvalue:61
        def:0
        lookrange:300
        str:24
        min:9
        exp:0
        lv:1

        scale : 0.7
        equips:[]

    }

    addequip:(equip) ->
      this.equips.push(equip)
      this.resetattr()
      this.setattr()

    offequip:(equip) ->
        for i in [0..this.equips.length - 1]
            if this.equips[i].gid == equip
                this.equips.splice(i, 1)
                this.resetattr()
                this.setattr()
                return true
        return false



    addexp:(exp) ->
      this.exp= this.exp + exp
      upexp = 100 * (this.lv+1)
      
      if this.exp >= upexp 
           this.lv = this.lv + 1
           console.log("this.lv is " + this.lv)
           this.lvlab.getComponent("cc.Label").string = ""+this.lv
           expadd = this.exp - upexp
           this.exp = 0
           this.resetattr()
           this.setattr()
           this.addexp(expadd)
      else
          this.expbar.getComponent("cc.ProgressBar").progress = this.exp/upexp

    addequipattr:(conf) ->
      console.log(conf)
      for k, v of conf
        console.log(k + this[k])
        if this[k] != undefined
          this[k] = this[k] + v
        
    resetattr:() ->
       this.min = 0
       conf = require("equipconf")
       
       console.log(this.equips)
       this.addequipattr conf[parseInt(k.uid)] for k in this.equips
       lv = this.lv-1
       #/*             0:力，1:敏，2:智，3:攻，4:防，5:血，6:蓝，7:移，8:主属，9:力成，10:敏成，11:智成  */
       #var this_hero = ["24","9","14","61-67","0.26","606","182","285","0","3","0.9","1.6"];
       this.str = 24+lv*3
       this.min = parseInt(9+lv*0.9) + this.min
       this.attackvalue = 61 + lv*3
       hpcut = this.hpmax - this.hp
       this.hpmax = 150+this.str*19
       this.hp = this.hpmax - hpcut
       this.def = parseInt(this.min/7)
       console.log("this.min is " + this.min + " this.def is " + this.def)


    setattr:() ->
       this.hpbar.getComponent("cc.ProgressBar").progress = this.hp/this.hpmax
       if this.uid == this.map.getComponent("map").uid
            this.attrba.getComponent("setattr").setattack(this.attackvalue)
            this.attrba.getComponent("setattr").setdef(this.def)
            this.attrba.getComponent("setattr").sethp(this.hp)
            this.attrba.getComponent("setattr").setstrong(this.str)
            this.attrba.getComponent("setattr").setminjie(this.min)
            
    
    getkillexp:(lv) ->
        if lv > 4
           return 100*(lv-2)
        if lv == 1 
           return 100
        if lv == 2 
           return 120
        if lv == 3 
           return 160
        if lv == 4 
           return 220

    attack:() ->
        console.log("start attck")
        if cc.isValid(this.hittarget) == false
            this.idle()
            return
        if this.hittarget.getComponent("global")
            iskill = this.hittarget.getComponent("global").attacked(this.attackvalue)
            if iskill == true
                lv = this.hittarget.getComponent("global").lv
                expadd = this.getkillexp(lv)
                this.addexp(expadd)
                cc.find("rank").getComponent("rank").addscore(this.uid, this.name, lv)
                console.log("set idle")
                this.hittick = 0
                this.idle()
        else
            iskill = this.hittarget.getComponent("monster").attacked(this.attackvalue)
            if iskill == true
                expadd = 70
                this.addexp(expadd)
                console.log("set idle")
                this.hittick = 0
                this.idle()
 
    attacked: (attvalue) ->
        defminus = this.def * (0.06 /(1+0.06 * this.def))
        attvalue =  attvalue + Math.floor(Math.seededRandom()*5) - 9
        attvalue = Math.round(attvalue*(1-defminus))
        this.hp = this.hp - attvalue
        #this.hurtlabel.active = true
        hurtlab = cc.instantiate(this.hurtlabel)
        hurtlab.parent = this.node
        hurtlab.Opacity = 255
        hurtlab.setPosition(0, 50)
        hurtlab.runAction(cc.fadeIn(0.01))
        
        hurtlab.getComponent("cc.Label").string = "-"+attvalue
        if this.uid == this.map.getComponent("map").uid
            hurtlab.color = cc.color(255,0,0)
        
        hurtlab.scaleX = 0.5
        hurtlab.scaleY = 0.5
        action1 = cc.moveTo(0.6, 0, 100);
        action2 = cc.scaleTo(0.1, 1.3, 1.3);
        action3 = cc.scaleTo(0.1, 1.0, 1.0);
        action4 = cc.fadeOut(0.2);
        action5 = cc.scaleTo(0.3, 0.5, 0.5)
        removefun = ()->
            hurtlab.destroy()
        finished = cc.callFunc(removefun ,this, hurtlab);
        seq1 = cc.sequence(action2, action3, action5);
        seq2 = cc.sequence(action1, finished)
        seq3 = cc.sequence(cc.delayTime(0.3), action4);
        hurtlab.runAction(seq1)
        hurtlab.runAction(seq2)
        hurtlab.runAction(seq3)
        
        if this.hp <= 0
            return true
        else
            this.setattr()
            return false

    changedir: (x, y) ->
        difx = x-this.node.x;
        dify = y-this.node.y;
        tan= dify/difx;
        tan30 = 0.57735
        tan60 = 1.73205
        scale = this.scale
        this.actornode.scaleY = scale
        if difx>0 and dify >0
            if tan < tan30
                this.direct = "3"
                this.actornode.scaleX = -scale
            else if tan > tan60
                this.direct = "5"
                this.actornode.scaleX = -scale
            else 
                this.direct = "4"
                this.actornode.scaleX = -scale
        else if difx>0 and dify <0
           tan = -dify/difx
           if tan < tan30
                this.direct = "3"
                this.actornode.scaleX = -scale
            else if tan > tan60
                this.direct = "1"
                this.actornode.scaleX = -scale
            else
                this.direct = "2"
                this.actornode.scaleX = -scale  
        else if difx<0 and dify>0
            tan = -dify/difx;
            if tan < tan30
                this.direct = "3"
                this.actornode.scaleX = scale;
            else if tan >tan60
                this.direct = "5"
                this.actornode.scaleX = scale  ;
            else
                this.direct = "4"
                this.actornode.scaleX = scale;     
        else if difx<0  and  dify <0
            tan = dify/difx;
            if tan < tan30
                this.direct = "3"
                this.actornode.scaleX = scale;
            else if tan >tan60
                this.direct = "1"
                this.actornode.scaleX = scale ; 
            else
                this.direct = "2"
                this.actornode.scaleX = scale;  
        this.arf =Math.abs(Math.atan(dify/difx));

    changeTarget: (x, y) ->
         
        this.changedir(x, y)
        this.targetx = x;
        this.targety = y;
        this.run()
        
        
    doaction: () ->
        action = "xiao"+this.actiontype+this.direct
        if this.oldaction == action 
            #console.log("this. hittick is " + this.hittick + "this.actiontype is " + this.actiontype)
            if this.actiontype == "2" 
               this.hittick=this.hittick+1
               if this.hittick == 12 
                   this.attack()
               else if this.hittick >= 16
                   this.idle()
            else
               this.hittick=0
            return
        else if this.actiontype == "2" and this.hittick > 4
            this.hittick = this.hittick + 1
            if this.hittick == 12 
                this.attack()
            else if this.hittick >= 16
                this.idle()
            return
        this.hittick=0
        this.actionstatus = this.actornode?.getComponent("cc.Animation").play(action)
        this.actionstatus.speed = this.map.getComponent("map").animationspeed
        this.oldaction = action

    
    hit:() ->
        this.changedir(this.hittarget.x, this.hittarget.y)
        this.actiontype = "2"
        this.doaction()
        
    idle:() ->
        this.buffer = null
        this.cy1.active = false
        this.actiontype = "1"
        this.doaction()
        #animState.repeatCount = Infinity
        
    run:() ->
        this.actiontype = "3"
        this.doaction()

    setdesc: () ->

       
        itemdesc = cc.find("herodesc")
        itemdesc.active = true
        #itemdesc.x = 300

        name = itemdesc.getChildByName("namelabel")
        shuxing = itemdesc.getChildByName("shuxing")
        desc = itemdesc.getChildByName("desc")
        name.getComponent("cc.Label").string = this.namestr + "(" + this.lv + "lv)"
        #desc.getComponent("cc.Label").string = this.desc+" "
        str = ""

        if this.hp != undefined  then str=str+this.hp+"点生命\n"
        if this.attr != undefined  then str=str+this.attr+"攻击\n"
        if this.def != undefined  then str=str+this.def+"护甲\n"
        if this.min != undefined  then str=str+this.min+"敏捷\n"
        if this.str != undefined  then str=str+this.str+"力量\n"
        if this.xixue != undefined then str=str+this.xixue+"吸血\n"
        if this.baoji != undefined  then str=str+this.baoji+"暴击\n"
        if this.shanbi != undefined  then str=str+this.shanbi+"闪避\n"
        if this.yisu != undefined  then str=str+this.yisu+"移动速度\n"
        if this.gongsu != undefined then str=str+this.gongsu+"攻击速度\n"
        shuxing.getComponent("cc.Label").string = str
        #desc.y = shuxing.y - shuxing.height 

    initsmallpoint:() ->
        oldparent = this.smallpoint.parent
        this.smallpoint1 = cc.instantiate(this.smallpoint)
        this.smallpoint1.parent = oldparent
        this.smallpoint1.x = this.node.x / 20
        this.smallpoint1.y = this.node.y / 20
        if this.uid == this.map.getComponent("map").uid
        else
            this.smallpoint1.color = cc.color(255,0,0)
    onLoad:() ->
        require("random")
        self = this
        this.node.on('mousedown', 
        (event) ->
            if event.getButton() == cc.Event.EventMouse.BUTTON_LEFT
               self.setdesc()
            )
        this.actornode = this.node.getChildByName("actornode");
        this.namelabel = this.node.getChildByName("heroname");
       # this.hurtlabel = this.node.getChildByName("hurt");

        this.lv=1
        this.resetattr()
        this.setattr()
        

    setname:(name) ->
        this.namestr = name
        this.namelabel.getComponent("cc.Label").string = name 
    update_move: () ->
        
        speed = this.speed*6
        if this.buffer == "cs1"
           if this.hp >10
               this.hp=this.hp-1-parseInt(this.hp * 0.01)
               this.setattr()
           speed = speed * 3
        if this.actiontype isnt "3" 
            return
        if Math.abs(this.targetx - this.node.x) < 8 and Math.abs(this.targety - this.node.y)<8 
            this.idle()
            return

        if this.targetx > this.node.x
            this.node.x = this.node.x + speed*Math.cos(this.arf);
        else
            this.node.x = this.node.x - speed*Math.cos(this.arf);
        
        if this.targety > this.node.y
            this.node.y = this.node.y + speed*Math.sin(this.arf);
        else
            this.node.y = this.node.y - speed*Math.sin(this.arf);
        this.setname(this.namestr)
        
        if this.smallpoint1 
            this.smallpoint1.x = this.node.x / 20 - 6
            this.smallpoint1.y = this.node.y / 20 -4
        else
            this.initsmallpoint()

    update: (dt) ->
        this.actionstatus?.speed = this.map.getComponent("map").animationspeed * 1.5

         



        
            

}
