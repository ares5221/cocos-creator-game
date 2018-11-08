cc.Class({
    extends: cc.Component,

    properties: {


        ranklist:[],
        rankui: {
            default:null,
            type: cc.Node,
        },
        rankuione: {
            default:null,
            type: cc.Node,
        },
        


    },

  

    // use this for initialization
    onLoad: function () {
        this.ranklist = []
        this.rankui = cc.find("rank")
        this.rankuione = cc.find("rank_one")
 
    },

    refresh:function(){
         this.rankui.removeAllChildren()
         var y = 0
        this.ranklist.sort(function(a,b){
            return a.score<b.score;
            });
        var maxi = this.ranklist.length
        if(maxi > 10) maxi = 10
        for(var i = 0; i< this.ranklist.length; i++)
        {
           var node = cc.instantiate(this.rankuione)
           node.parent = this.rankui
           node.y = y
           y-=31
           var label = node.getChildByName("content")

           label.getComponent("cc.Label").string = i+1+"th. "+this.ranklist[i].name+": " + this.ranklist[i].score + ""

        } 

    },

    addscore:function(id, name,scoreadd){
        for(var i = 0; i< this.ranklist.length; i++)
        {
            if(this.ranklist[i].id == id){
                this.ranklist[i].score += scoreadd;
                this.refresh()
                return
            }
        }
        var rankone = {}
        rankone.id = id
        rankone.score = scoreadd
        rankone.name = name
        this.ranklist.push(rankone)
        this.refresh()

    },



   
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
