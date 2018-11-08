cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        
        socket: {
            default:null,
            type: cc.Node,
        },

        loading: {
            default:null,
            type: cc.Node,
        },  

        hero:{
            default: null,
            type: cc.Node
        },
        time:{
            default: null,
            type: cc.Node
        },
        heroself:{
            default: null,
            type: cc.Node
        },
        herolist:{
          default:null,
          type:cc.Node
        },
        monsterlist:{
          default:null,
          type:cc.Node
        },

        dt : 0,
        curtick:0,
        animationspeed:1,
        ticklist : [],
        maxtick : 0,
        uid:0


    },
    
    

    // use this for initialization
    onLoad: function () {
      cc.find("login").active = true

    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
      var now = Date.now()
      var tick = 50
      if(this.dt == 0 ) 
        {
          this.dt = now
          return
        } 
      var timediff = now - this.dt
      var tickcount = parseInt(timediff/tick)
      tickcount = Math.min(tickcount, 1)
      var costtime = tickcount*tick
      var timeleft = timediff - costtime
      this.dt = now - timeleft
      if (tickcount < 1) 
      {
        return
      }

      tickcount =  Math.min(this.maxtick - this.curtick, 100)
      if (cc.find("login").active == true)
      {
        var per = Math.round(this.curtick/this.maxtick * 100)
        this.loading.getComponent("cc.Label").string ="loading... " +  per + "%"
      }
      

      this.animationspeed = tickcount
      if (tickcount > 10) console.log("tickcount is " + tickcount)
      for (var i = this.curtick; i < this.curtick + tickcount; i++)
      {
          var tickinfo = this.ticklist[i]
          if(tickinfo != undefined)
          {

            for(var j = 0; j < tickinfo.list.length; j++)
            {
              var tick = tickinfo.list[j]
              if (tick.action == "move")
              {
                var children = this.herolist.getChildren()
                for(var k = 0; k < children.length; k ++)
                {
                    var hero = children[k].getComponent("global")
                    if(hero.uid == tick.uid)
                    {
                        hero.hittarget = null
                        if(tick.x == -1 && tick.y == -1)
                        {
                          hero.idle()
                        }
                        else if (tick.x == -2)
                        {

                          if(tick.y == -2)
                          {
                            if(hero.hp>10)
                            {
                             hero.buffer = "cs1"
                             hero.cy1.active = true
                             if(hero.actionstatus != null)
                             {
                                 hero.actionstatus.pause()
                             }
                            }
                             
                          }
                          else
                          {
                            hero.cy1.active = false
                             hero.buffer = null
                             if(hero.actionstatus != null)
                             {
                                 hero.actionstatus.resume()
                             }
                          }
                        }
                        else{
                            hero.cy1.active = false
                             hero.buffer = null
                             if(hero.actionstatus != null)
                             {
                                 hero.actionstatus.resume()
                             }
                          hero.changeTarget(tick.x,tick.y)
                        }
                        
                    }
                  }
              }
              else if(tick.action == "login")
              {

                var children = this.herolist.getChildren()
                var logined = false
                for(var k = 0; k < children.length; k ++)
                {
                  
                  var hero = children[k].getComponent("global")
                  if(hero.uid == tick.uid)
                  {
                     logined = true;
                  }
                }
                if(logined == true)continue
                console.log(tick.uid + " login" + tick.name)
                var node = cc.instantiate(this.hero);
                node.getComponent("global").uid = tick.uid
                
                node.parent = this.herolist
                node.setPosition(tick.x, tick.y)
                node.getComponent("global").setname(tick.name)
                cc.find("rank").getComponent("rank").addscore(tick.uid, tick.name, 0)
                if (tick.uid == this.uid)
                {
                  console.log(" login name" + tick.name)
                   
                  this.node.runAction(cc.follow(node, cc.rect(0,0,3200,3200)));
                  cc.find("login").active = false
                }
              }else if(tick.action == "off")
              {
                 var equipid = tick.name
                 
                 var equiplist = this.node.getChildByName("itemlist").getChildren()
                  var equipnode
                  var equipjs = null
                 for(var r = 0; r <equiplist.length; r++)
                 {
                   equipnode = equiplist[r]
                   equipjs = equipnode.getComponent("equip")
                   if (equipjs.gid == equipid)
                   {
                     equipnode.x = tick.x
                     equipnode.y = tick.y

                     break
                   }
                 }
                if(equipjs == null)
                {
                  var heronode = this.get_role_by_id(tick.uid)
                  var canoff = heronode.getComponent("global").offequip(equipid)
                  console.log("canoff is " + canoff)
                }
               // equipnode.runAction(cc.scaleTo(0.1, 0.5,0.5))
                 

                     
                     

                    //    var node = equipjs.getequiphold(tick.x, tick.y)
                    //   // equipnode.node.parent = null
                    //    console.log("node is " + node) 
                    //    equipnode.parent = node
                    //    console.log("node is " + equipnode)
                    //    equipnode.x = 0
                    //    equipnode.y = 0
                    //    equipnode.runAction(cc.scaleTo(0.1, 1,1))
                    //    equipjs.maptype = "equip"
                    //  }
                    //  else
                    //  {
                    //    equipnode.destroy() 
                    //  }
                 
                 
              }
              else if(tick.action == "on")
              {
                 var equipid = tick.name
                 
                 var equiplist = this.node.getChildByName("itemlist").getChildren()
                 for(var r = 0; r <equiplist.length; r++)
                 {
                   var equipnode = equiplist[r]
                   var equipjs = equipnode.getComponent("equip")
                   console.log("equipjs.gid is " + equipjs.gid + " equipid is " + equipid)
                   if (equipjs.gid == equipid)
                   {
                     var heronode = this.get_role_by_id(tick.uid)
                     heronode.getComponent("global").addequip(equipjs)
                     
                     equipnode.parent = null
                     if(tick.uid == this.uid)
                     {
                       var node = equipjs.getequiphold(tick.x, tick.y)
                        
                       console.log("node is " + node) 
                       equipnode.parent = node
                       console.log("node is " + equipnode)
                       equipnode.x = 0
                       equipnode.y = 0
                       equipnode.runAction(cc.scaleTo(0.1, 1,1))
                       equipjs.maptype = "equip"
                     }
                     else
                     {
                       equipnode.destroy() 
                     }

                   }
                 }
                 
              }
              else if(tick.action == "stop")
              {
                  this.reset()
              }
            }
          }
          this.update_dt()
      }
      this.curtick = this.curtick + tickcount
      this.time.getComponent("cc.Label").string = ""+Math.round(10*60 - this.curtick/20)
   
    },

    reset: function(){
        console.log("reset data")
        for(var k = 0; k < this.herolist.childrenCount ; k ++)
        {
          this.herolist.children[k].getComponent("global").smallpoint1.destroy()
          this.herolist.children[k].destroy()
        }
        this.ticklist = []
        this.curtick = 0
        this.maxtick = 0
        this.uid = 0
        cc.find("login").active = true
    },
    



    get_direct: function(node1, node2){
      var x1 = node1.x
      var x2 = node2.x
      var y1 = node1.y
      var y2 = node2.y
      return Math.sqrt((x1 - x2)*(x1 - x2) + (y1-y2)*(y1-y2))
    },
    get_direct2: function(x, y, node2){
      var x1 = x
      var x2 = node2.x
      var y1 = y
      var y2 = node2.y
      return Math.sqrt((x1 - x2)*(x1 - x2) + (y1-y2)*(y1-y2))
    },

    update_findtarget:function( global, nodes)
    {

      if(global.hittarget !== null || global.actiontype !== "1") return;

      var minrange = global.lookrange
       for (var j=0;j<nodes.length;j++)
       {
          if(nodes[j] === global.node || (cc.isValid(nodes[j]) == false)) 
          {
            continue;
          }
           var direct = this.get_direct2(global.node.x, global.node.y, nodes[j])

           if( direct< minrange) 
           {    
             global.hittarget = nodes[j]
           }
       }
    },

    get_main_hero_id:function () {
      return this.uid
    },

    get_role_by_id:function (uid) {
      var nodes = this.herolist.getChildren();
      for (var i=0;i<nodes.length;i++)
      {
        if (nodes[i].getComponent("global").uid == uid)
        {
          return nodes[i]
        }
      }
    },

    update_dt: function (){
    if(this.herolist == null) return;

    var nodes = this.herolist.getChildren();
    var nodes2 = this.monsterlist.getChildren();
    for (var i=0;i<nodes.length;i++)
    {
         if(cc.isValid(nodes[i]) == false) continue
         var global = nodes[i].getComponent("global")
         if(global.hp <= 0 )
         {
             if (nodes[i].getComponent("global").uid == this.uid)
             {
               this.node.stopAllActions()

               cc.find("login").active = true
               cc.find("login").getComponent("login").reset()
             } 
             if(global.smallpoint1 !== undefined)
             {
                  global.smallpoint1.destroy()
             }
             
             nodes[i].destroy()
         }
         else
         {
              global.update_move()

              this.update_findtarget(global, nodes2.concat(nodes))

              var target = global.hittarget
              if(target !== null && (cc.isValid(target) == true))
              {
                  var direct =this.get_direct(nodes[i], target)
                  
                  if (direct < 70)
                  {
                    global.hit()
                  }
                  else
                  {
                    global.changeTarget(target.x, target.y)
                  }
               }
               
               else if (target == null)
               {
               }
               else
               {
                  global.idle()
                  global.hittarget= null
               }

         }

       
    }
    
    
    for (var i=0;i<nodes2.length;i++)
    {
        if(cc.isValid(nodes2[i]) == false) continue
         var global = nodes2[i].getComponent("monster")
         if(global.hp <= 0 )
         {
             nodes2[i].destroy()
             continue
         }
         global.update_move()

         this.update_findtarget( global, nodes)

         var target = global.hittarget
         var direct1 = this.get_direct2(global.initx, global.inity, nodes2[i])
         if (direct1 > 500)
         {
           global.hittarget = null
           global.changeTarget(global.initx, global.inity)
           continue
         }

         if(target == null )
         {
           continue;
         }
         if(cc.isValid(target) == false)
         {
           global.idle()
           global.hittarget = null
           continue;
         }




         var direct =this.get_direct(nodes2[i], target)
         
         if (direct < 70)
         {
          global.hit()
         }
         else
         {
          global.changeTarget(target.x, target.y)
         }


       
    }
    },
});
