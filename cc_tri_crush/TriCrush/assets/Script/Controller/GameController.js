import GameModel from "../Model/GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
        grid:{
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        }
    },

    // 初始化游戏界面
    onLoad: function () {
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        //给grid添加GridView脚本组件
        var gridScript = this.grid.getComponent("GridView");
        //调用GridView脚本中的方法
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
        // debug 显示初始化生成的grid中cells的情况即每个位置对应是什么动物
        this.gameModel.printInfo();
        //检测是否一段时间无操作
        this.startTime = 0; //开始时间
        this.curTime = 0;  //消耗时间
        this.isClick = false;
    },

    displayScore: function () {
        // this.score += 30;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score :' + this.gameModel.gainScore();
        //gameover
        if (this.gameModel.gainScore()> 2000000){
            this.gameOver();
        }
    },

    //游戏操作，点击某一个格子，将其设置为选中状态开始
    selectCell: function(pos){
        this.isClick = true;
        return this.gameModel.selectCell(pos);
    },
    cleanCmd: function(){
        this.displayScore();
        this.gameModel.cleanCmd();
        this.curTime = 0;
        this.isClick = false;
    },
    gameOver: function () {
        this.grid.stopAllActions(); //停止 gird 动作
        cc.director.loadScene('Login');
    },
    // 每帧执行
    update: function (dt) {
        this.curTime += dt;
        if(this.curTime - this.startTime > 2 && this.isClick == false){
            // console.log("超过5s没有操作------>开始搜索可交换位置");
            let result = [];
            result = this.gameModel.findSelectCell();
            console.log(result[0].count+ " " +result[0]);
            if(!result[0] && this.gameModel.death_sign){
                //重置
                console.log("---开始重置---");
                let newCells = [];
                newCells = this.gameModel.reInitWithData();
                var gridScript = this.grid.getComponent("GridView");
                //调用GridView脚本中的方法
                gridScript.setController(this);
                gridScript.resetGrid();
                // gridScript.initWithCellModels(newCells);
                console.log("---重置OK---");
                // this.gameOver();
                sss +=1;
            }
            console.log("提示该cell可被消除 " + result[0].reverse()+ "@@@@@" + result[1].reverse() + "#####" + result[2].reverse());
            //将找到的cell设置为跳动的动画
            let ss = result[0].reverse();
            
            let cellpos = cc.v2(-1,-1);
            cellpos.x = ss[1];
            cellpos.y = ss[0];
            // let ss1 = result[1].reverse();
            // let cellpos1 = cc.v2(-1,-1);
            // cellpos1.x = ss1[1];
            // cellpos1.y = ss1[0];
            // let ss2 = result[2].reverse();
            // let cellpos2 = cc.v2(-1,-1);
            // cellpos2.x = ss2[1];
            // cellpos2.y = ss2[0];
            var gridScript = this.grid.getComponent("GridView");
            gridScript.selectCell(cellpos);
            // gridScript.selectCell(cellpos1);
            // gridScript.selectCell(cellpos2);
        }
    
    }
});
