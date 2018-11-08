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
        hittick:0

        initx:0
        inity:0
       hurtlabel:
            default:null,
            type: cc.Node,
        socket: 
            default:null,
            type: cc.Node,
            
        map: 
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
            
        hp:606
        hpmax:606
        attackvalue:61
        def:0
        lookrange:300
        str:24
        min:9
        ciptype:"doushi"

        scale : 0.7

    }
    initattr:() ->
       this.hpmax = 300
       this.hp = 300
       this.attackvalue = 20
       this.def = 2
    
    attack:() ->
        if this.hittarget == null or cc.isValid(this.hittarget) == false
            this.idle()
            return
        iskilled = this.hittarget.getComponent("global").attacked(this.attackvalue)
        if iskilled == true
            console.log("monster kill ")
            this.hittarget = null
            this.idle()
    
    attacked: (attvalue) ->
        defminus = this.def * (0.06 /(1+0.06 * this.def))
        attvalue =  attvalue + Math.floor(Math.seededRandom()*5) - 9
        attvalue = Math.round(attvalue*(1-defminus));
        this.hp = this.hp - attvalue
        hurtlab = cc.instantiate(this.hurtlabel)
        hurtlab.parent = this.node
        hurtlab.Opacity = 255
        hurtlab.setPosition(0, 50)
        hurtlab.runAction(cc.fadeIn(0.01))
        
        hurtlab.getComponent("cc.Label").string = "-"+attvalue
        
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
            this.hpbar.getComponent("cc.ProgressBar").progress = this.hp/this.hpmax
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
                this.actornode.scaleX = scale
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
                this.actornode.scaleX = scale
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
        action = this.ciptype+this.actiontype+this.direct
        if this.oldaction == action 
            if this.actiontype == "2" 
               this.hittick = this.hittick + 1
               if this.hittick == 12 
                   this.attack()
               else if this.hittick == 16
                   this.idle()
            else
               this.hittick=0
            return
        else if this.actiontype == "2" and this.hittick > 4
            this.hittick = this.hittick + 1
            if this.hittick == 12 
                this.attack()
            else if this.hittick == 16
                this.idle()
            return

        this.hittick=0
        console.log("user " + this.namestr+" play animation " +action)
        this.actionstatus = this.actornode?.getComponent("cc.Animation").play(action)
        this.actionstatus?.speed = this.map.getComponent("map").animationspeed
        this.oldaction = action

    
    hit:() ->
        this.changedir(this.hittarget.x, this.hittarget.y)
        this.actiontype = "2"
        this.doaction()
        
    idle:() ->
        this.actiontype = "1"
        this.doaction()

        
    run:() ->
        this.actiontype = "3"
        this.doaction()
    onLoad:() ->
        this.node.on('mousedown', 
        (event) ->
            #animState = this.actor.getComponent(cc.Animation).play("xiao21")
           # animState.repeatCount = 1;
            )
        this.actornode = this.node.getChildByName("actornode");
        this.namelabel = this.node.getChildByName("heroname");
        this.initx = this.node.x
        this.inity = this.node.y
        this.initattr()

    setname:(name) ->
        this.namestr = name
        this.namelabel.getComponent("cc.Label").string = name
    update_move: () ->
        speed = this.speed*6
        if this.actiontype isnt "3" 
            return
        if Math.abs(this.targetx - this.node.x) < 3 and Math.abs(this.targety - this.node.y)<3 
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

    update: (dt) ->
        this.actionstatus?.speed = this.map.getComponent("map").animationspeed * 1.5

         



        
            

}
