var Helpers = require('Helpers')

cc.Class({
    extends: cc.Component,

    properties: {
        ['速度(像素/秒)']: 50,
        curExp: 0,
        curLv: 0,
        sectionPrefab:{
            default: null,
            type: cc.Prefab,
        },
        moveDirRot: 90,

    },
    // use this for initialization
    onLoad: function () {
        this.index = 0
        this.node.zIndex = 255
        this.addTailDt = this['速度(像素/秒)'] * 0.0005
        this.speed = this['速度(像素/秒)']
        this.sectionPool = new cc.NodePool('sectionPool');
        this.isStop = false



        this.onControl()
        this.initIt()

        this.MapRect = cc.rect(0, 0, this.node.parent.width, this.node.parent.height)


    },

    //玩家的操作行为处理
    onControl: function () {
        //全局保存当前玩家
        cc.director.Player = this

        var len = 500
        var moveVec = cc.pForAngle(this.moveDirRot  * (Math.PI / 180))
        this.moveDirVec = moveVec

        this.node.rotation = 90 - this.moveDirRot

        //镜头跟随
        var followAction = cc.follow(this.node);
        followAction.setTag(100)
        this.node.parent.stopActionByTag(100)
        this.node.parent.runAction(followAction);

        //眼睛移动
        this.moveEye()


        //接收到点击移动的操作信息
        cc.director.GlobalEvent.on('moveTo', function (data) {
            var aimVec = this.node.parent.convertTouchToNodeSpace(data)
            
            
            //目标向量
            var selfVec = cc.p(this.node.x, this.node.y)
            var moveByAimVec = cc.pNormalize(cc.pSub(aimVec, selfVec))
            this.moveDirVec.x = moveByAimVec.x
            this.moveDirVec.y = moveByAimVec.y

            var rot = cc.pToAngle(moveByAimVec) * (180 / Math.PI)

            this.node.rotation = 90 - rot
        }, this)

        //接收到加速的消息
        cc.director.GlobalEvent.on('isAddSpeedMove', function (data) {
            var isAdd = data

            if (isAdd) {
                this.speed = this['速度(像素/秒)'] * 2
            } else {
                this.speed = this['速度(像素/秒)']
            }
            // console.log('重置尾巴动作');
            this.runAddTailAction()

        }, this)
    },

    //初始化蛇的样子
    initIt: function () {
        
        var colorAry = Helpers.getRandomColor()
        this.node.color = new cc.Color(colorAry[0], colorAry[1], colorAry[2])
        
        this.runAddTailAction()
    },

    //运行不停生成尾巴的动作
    runAddTailAction: function () {
        var dt = this.getAddTailDt()
        var action = cc.repeatForever(cc.sequence(
                cc.callFunc(function(){
                    this.createSection()
                }, this),
                cc.delayTime(dt),
        ))
        action.setTag(125)
        this.node.stopActionByTag(125)
        this.node.runAction(action)
    },

    //获取尾巴生成公式
    getAddTailDt: function () {
        return 6 / this.speed
    },

    //创建蛇的段
    createSection: function () {

        var node
        if (this.sectionPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.sectionPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.sectionPrefab);
        }
        node.color = this.node.color
        node.scale = this.node.scale
        node.rotation = this.node.rotation
        node.x = this.node.x
        node.y = this.node.y
        node.parent = this.node.parent

        
        var srcLen = 1
        var dt = this.curLv * 0.2 + srcLen
        var action = cc.sequence(
                cc.delayTime(dt),
                cc.scaleTo(dt / 2, this.node.scale - 1),
                cc.callFunc(function(){
                    this.sectionPool.put(node)
                }, this),
        )
        node.runAction(action)
    },


    //获取杀死一个怪物得到的经验
    getExp: function (enemyLv) {
        //(怪物等级-1)*2+60 
        return (enemyLv-1) * 2 + 60
    },

    //下一等级的计算公式，如果是true就要升级
    cal: function () {
        var nextExp = Math.floor(((this.curLv-1)^3+60)/5*((this.curLv-1)*2+60)+60,50)
        // console.log('经验：', nextExp, this.curExp);


        if (nextExp <= this.curExp) {
            this.curExp = this.curExp - nextExp
            return true
        }
        
    },

    //动眼睛
    moveEye: function () {
        var rot = Helpers.getRandom(0, 360)
        var eyeNode1 = cc.find('Canvas/bg/she/yan1/eye')
        this.moveEyeAction(eyeNode1, rot)
        var eyeNode2 = cc.find('Canvas/bg/she/yan2/eye')
        this.moveEyeAction(eyeNode2, rot)
    },

    //动眼睛的动作实现
    moveEyeAction: function (eyeNode, rot) {
        var dt = 10
        var len = 3
        var moveDt = dt / 2
        var action = cc.repeatForever(cc.sequence(
            cc.callFunc(function(){
                var eyeNode = arguments[1]
                var moveVec = cc.pMult(cc.pForAngle(rot * (Math.PI / 180)), len)
                eyeNode.runAction(cc.sequence(
                    cc.moveBy(moveDt, moveVec),
                    cc.moveBy(moveDt, cc.pNeg(moveVec)),
                ))
            }, this, eyeNode),
            cc.delayTime(dt),
        ))
        eyeNode.runAction(action)
    },

    

    //碰撞回调
    onCollisionEnter: function (other, self) {
        //自己的头碰到食物
        if (self.tag == Helpers.MyHeadTag && other.tag == Helpers.FoodTag) {
            // console.log('吃到食物', this.curLv);
            this.curExp += this.getExp(1)//吃到食物假设是得到1个1级怪的经验
        }

        //判断是否需要升级
        if (this.cal()) {
            this.curLv += 1

            //变大
            var scale = (this.curLv - 1) * 0.1 + 1
            this.node.scale += 0.01

            //加速度
            this.speed += 1
            this.runAddTailAction()//重置尾巴表现

            console.log('升级表现');
        }
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.isStop) {
            return
        }

        this.node.x += this.moveDirVec.x * this.speed * dt
        this.node.y += this.moveDirVec.y * this.speed * dt

        if(!cc.rectContainsPoint(this.MapRect, cc.p(this.node.x, this.node.y))){
            this.isStop = true
            this.node.stopAllActions()
        }

    },
});
