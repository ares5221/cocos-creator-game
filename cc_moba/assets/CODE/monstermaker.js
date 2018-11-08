cc.Class({
    extends: cc.Component,

    properties: {

        map: {
            default:null,
            type: cc.Node,
        },
        monster: {
            default:null,
            type: cc.Node,
        }
    },

    maker:function(name, x, y){
        var monster = cc.instantiate(this.monster);
        monster.x = x
        monster.y = y
        monster.parent = this.map.getChildByName("monsterlist")
        var actor = monster.getChildByName("actornode")

        var animation = actor.getComponent("cc.Animation")
        this.loadanimation(animation, name, monster)
        

    },

    loadanimation: function (animation, frameName, monster) {
        let self = this
      cc.loader.loadRes(frameName, cc.SpriteAtlas, function (err , atlas) {
              console.log("err is " + err)
              for(let i = 1; i < 4; i++){
                  for(var j = 0;j<5 ;j++)
                  {
                      var frames = [];
                      for( var k = 0; k<6;k++)
                      {
                          var fname = i+""+j+""+k+".png.pvr"
                          var f = atlas.getSpriteFrame(fname)
                          
                         frames.push(f);

                      }
                      var clip = cc.AnimationClip.createWithSpriteFrames(frames, 6);
                      console.log( frameName+i+j + " animation length " + frames.length)
                      clip.wrapMode  = 2
                      var ii = 1
                      if(i == 2)
                      {
                          ii = 3
                      }
                      else if (i==3)
                      {
                          ii = 2
                      }
                      
                      animation.addClip(clip, frameName+ii+(j+1));
                  }
                    
              }
              monster.getComponent("monster").scale = 1.2
              monster.getComponent("monster").ciptype = frameName
              monster.getComponent("monster").changedir(1,1)
              monster.getComponent("monster").idle()

              
              
       })
    },

    // use this for initialization
    onLoad: function () {
        let self = this
        
    this.scheduleOnce(function() {
        // 这里的 this 指向 component
        var monster = ["gd", "nt", "rm", "sb", "sr", "yw", "yw"]
        for(var i = 0; i< 50;i ++)
        {
        var name = monster[parseInt(1 + Math.seededRandom()*6)]
        var x = 3000*Math.seededRandom()
        var y = 3000*Math.seededRandom()
        this.maker(name, parseInt(x), parseInt(y))
        }
    }, 2);

        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
