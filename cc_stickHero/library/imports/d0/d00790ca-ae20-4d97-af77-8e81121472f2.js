var spriteCreator = require("spriteCreator");
var perfectLabel = require("perfectLabel");
var storageManager = require("storageManager");
var fsm = new StateMachine({
    data: {
        gameDirector: null
    },
    init: 'stand',
    transitions: [{ name: 'stickLengthen', from: 'stand', to: 'stickLengthened' }, { name: 'heroTick', from: 'stickLengthened', to: 'heroTicked' }, { name: 'stickFall', from: 'heroTicked', to: 'stickFalled' }, { name: 'heroMoveToLand', from: 'stickFalled', to: 'heroMovedToLand' }, { name: 'landMove', from: 'heroMovedToLand', to: 'stand' }, { name: 'heroMoveToStickEnd', from: 'stickFalled', to: 'heroMovedToStickEnd' }, { name: 'heroDown', from: 'heroMovedToStickEnd', to: 'heroDowned' }, { name: 'gameOver', from: 'heroDowned', to: 'end' }, { name: 'restart', from: 'end', to: 'stand' }],
    methods: {
        onLeaveHeroTicked: function onLeaveHeroTicked() {
            gameDirector.unregisterEvent();
        },
        onStickLengthen: function onStickLengthen() {
            gameDirector.stickLengthen = true;
            gameDirector.stick = gameDirector.createStick();
            gameDirector.stick.x = gameDirector.hero.x + gameDirector.hero.width * (1 - gameDirector.hero.anchorX) + gameDirector.stick.width * gameDirector.stick.anchorX;
            var ani = gameDirector.hero.getComponent(cc.Animation);
            ani.play('heroPush');
        },
        onHeroTick: function onHeroTick() {
            gameDirector.stickLengthen = false;
            var ani = gameDirector.hero.getComponent(cc.Animation);
            ani.play('heroTick');
        },
        onStickFall: function onStickFall() {
            //stick fall action.
            var stickFall = cc.rotateBy(0.5, 90);
            stickFall.easing(cc.easeIn(3));
            var callFunc = cc.callFunc(function () {
                var stickLength = gameDirector.stick.height - gameDirector.stick.width * gameDirector.stick.anchorX;
                if (stickLength < gameDirector.currentLandRange || stickLength > gameDirector.currentLandRange + gameDirector.secondLand.width) {
                    //failed.
                    fsm.heroMoveToStickEnd();
                } else {
                    //successed
                    fsm.heroMoveToLand();
                    if (stickLength > gameDirector.currentLandRange + gameDirector.secondLand.width / 2 - 5 && stickLength < gameDirector.currentLandRange + gameDirector.secondLand.width / 2 + 5) {
                        gameDirector.perfect++;
                        gameDirector.getScore(gameDirector.perfect);
                        var pl = gameDirector.perfectLabel.getComponent(perfectLabel);
                        pl.showPerfect(gameDirector.perfect);
                    } else {
                        gameDirector.perfect = 0;
                    }
                }
            });
            var se = cc.sequence(stickFall, callFunc);
            gameDirector.stick.runAction(se);
        },
        onHeroMoveToLand: function onHeroMoveToLand() {
            var ani = gameDirector.hero.getComponent(cc.Animation);
            var callFunc = cc.callFunc(function () {
                ani.stop('heroRun');
                gameDirector.getScore();
                fsm.landMove();
            });
            ani.play('heroRun');
            gameDirector.heroMove(gameDirector.hero, { length: gameDirector.currentLandRange + gameDirector.secondLand.width, callFunc: callFunc });
        },
        onLandMove: function onLandMove() {
            var callFunc = cc.callFunc(function () {
                gameDirector.registerEvent();
            });
            gameDirector.landCreateAndMove(callFunc);
        },
        onHeroMoveToStickEnd: function onHeroMoveToStickEnd() {
            var ani = gameDirector.hero.getComponent(cc.Animation);
            var callFunc = cc.callFunc(function () {
                ani.stop('heroRun');
                fsm.heroDown();
            });
            ani.play('heroRun');
            gameDirector.heroMove(gameDirector.hero, { length: gameDirector.stick.height, callFunc: callFunc });
        },
        onHeroDown: function onHeroDown() {
            var callFunc = cc.callFunc(function () {
                fsm.gameOver();
            });
            gameDirector.stickAndHeroDownAction(callFunc);
        },
        onGameOver: function onGameOver() {
            gameDirector.overLabel.node.active = true;
        },
        onRestart: function onRestart() {
            cc.director.loadScene("MainGameScene");
        }
    }
});
var gameDirector = null;
cc.Class({
    "extends": cc.Component,
    properties: {
        landRange: cc.v2(20, 300),
        landWidth: cc.v2(20, 200),
        hero: cc.Node,
        firstLand: cc.Node,
        secondLand: cc.Node,
        moveDuration: 0.5,
        stickSpeed: 400,
        heroMoveSpeed: 400,
        // stick:cc.Node,
        // stickLengthen:false,
        stickWidth: 6,
        canvas: cc.Node,
        scoreLabel: cc.Label,
        hightestScoreLabel: cc.Label,
        overLabel: cc.Label,
        perfectLabel: cc.Node
    },
    onLoad: function onLoad() {
        //init data
        // alert(storageManager.getHighestScore());
        gameDirector = this;
        this.runLength = 0, this.stick = null;
        this.stickLengthen = false;
        this.score = 0;
        this.perfect = 0;
        this.currentLandRange = 0;
        this.heroWorldPosX = 0;
        this.changeHightestScoreLabel();

        //create new land;
        this.createNewLand();
        var range = this.getLandRange();
        this.heroWorldPosX = this.firstLand.width - (1 - this.hero.anchorX) * this.hero.width - this.stickWidth;
        this.secondLand.setPosition(range + this.firstLand.width, 0);

        this.registerEvent();
        //init hero animation callback.
        var ani = gameDirector.hero.getComponent(cc.Animation);
        ani.on('stop', function (event) {
            if (event.target.name == 'heroTick') {
                fsm.stickFall();
            }
        });
    },
    registerEvent: function registerEvent() {
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this), this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this), this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this), this.node);
        console.log("on");
    },
    unregisterEvent: function unregisterEvent() {
        this.canvas.targetOff(this.node);
        console.log("off");
    },
    update: function update(dt) {
        // console.log(dt);
        if (this.stickLengthen) {
            this.stick.height += dt * this.stickSpeed;
            // this.stick.height = this.currentLandRange + this.secondLand.width/2;
        }
    },
    touchStart: function touchStart(event) {
        fsm.stickLengthen();
        cc.log("touchStart");
    },
    touchEnd: function touchEnd(event) {
        fsm.heroTick();
        cc.log("touchEnd");
    },
    touchCancel: function touchCancel() {
        this.touchEnd();
        cc.log("touchCancel");
    },
    stickAndHeroDownAction: function stickAndHeroDownAction(callFunc) {
        //stick down action;
        var stickAction = cc.rotateBy(0.5, 90);
        stickAction.easing(cc.easeIn(3));
        this.stick.runAction(stickAction);
        //hero down action;
        var heroAction = cc.moveBy(0.5, cc.p(0, -300 - this.hero.height));
        heroAction.easing(cc.easeIn(3));
        var seq = cc.sequence(heroAction, callFunc);
        this.hero.runAction(seq);
    },
    heroMove: function heroMove(target, data) {
        var time = data.length / this.heroMoveSpeed;
        var heroMove = cc.moveBy(time, cc.p(data.length, 0));
        if (data.callFunc) {
            var se = cc.sequence(heroMove, data.callFunc);
            this.hero.runAction(se);
        } else {
            this.hero.runAction(heroMove);
        }
    },
    landCreateAndMove: function landCreateAndMove(callFunc) {
        var winSize = cc.director.getWinSize();
        //firstland;
        var length = this.currentLandRange + this.secondLand.width;
        this.runLength += length;
        var action = cc.moveBy(this.moveDuration, cc.p(-length, 0));
        this.node.runAction(action);
        this.firstLand = this.secondLand;

        this.createNewLand();

        //landRange
        var range = this.getLandRange();

        //secondland;
        this.secondLand.setPosition(this.runLength + winSize.width, 0);
        var l = winSize.width - range - this.heroWorldPosX - this.hero.width * this.hero.anchorX - this.stickWidth;
        var secondAction = cc.moveBy(this.moveDuration, cc.p(-l, 0));
        var seq = cc.sequence(secondAction, callFunc);
        this.secondLand.runAction(seq);
    },
    createStick: function createStick() {
        cc.log("sc");
        var stick = spriteCreator.createStick(this.stickWidth);
        stick.parent = this.node;
        return stick;
    },
    createNewLand: function createNewLand() {
        this.secondLand = spriteCreator.createNewLand(this.getLandWidth());
        this.secondLand.parent = this.node;
    },
    getScore: function getScore(num) {
        if (num) {
            this.score += num;
        } else {
            this.score++;
        }
        if (storageManager.getHighestScore() < this.score) {
            storageManager.setHighestScore(this.score);
            this.changeHightestScoreLabel();
        }
        this.scoreLabel.string = "得分:" + this.score;
    },
    changeHightestScoreLabel: function changeHightestScoreLabel() {
        this.hightestScoreLabel.string = "最高分:" + storageManager.getHighestScore();
    },
    getLandRange: function getLandRange() {
        this.currentLandRange = this.landRange.x + (this.landRange.y - this.landRange.x) * Math.random();
        var winSize = cc.director.getWinSize();
        if (winSize.width < this.currentLandRange + this.heroWorldPosX + this.hero.width + this.secondLand.width) {
            this.currentLandRange = winSize.width - this.heroWorldPosX - this.hero.width - this.secondLand.width;
        }
        return this.currentLandRange;
    },
    getLandWidth: function getLandWidth() {
        return this.landWidth.x + (this.landWidth.y - this.landWidth.x) * Math.random();
    }
});
module.exports = fsm;