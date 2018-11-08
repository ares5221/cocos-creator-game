// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var ScoreView = cc.Class({
    extends: cc.Component,

    properties: {
        nodeLevel: {
            default: null,
            type: cc.Node,
        },

        scoreTarget: {
            default: null,
            type: cc.Node,
        },

        scoreCurrent: {
            default: null,
            type: cc.Node,
        },

        scoreBonus: {
            default: null,
            type: cc.Node,
        },

        scoreCellPrefab: {
            default: null,
            type: cc.Prefab,
        },

        scoreCellParent: {
            default: null,
            type: cc.Node,
        },

        scoreTotalPrefab: {
            default: null,
            type: cc.Prefab,    
        },

        scoreTotalParent: {
            default: null,
            type: cc.Node,
        },
    },

    statics: {
        instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScoreView.instance = this;
        this.scoreCellPool = new cc.NodePool('ScoreCell');
        this.scoreTotalPool = new cc.NodePool('ScoreTotal');
    },

    initWithLevelInfo(levelInfo) {
        this.nodeLevel.getComponentInChildren(cc.Label).string = "LV: " + levelInfo.level;
        this.nodeLevel.getComponentInChildren(cc.Animation).play();

        this.scoreTarget.getComponent(cc.Label).string = "Target: " + levelInfo.target;
        this.scoreTarget.getComponent(cc.Animation).play();

        this.scoreCurrentInt = levelInfo.score;
        this.scoreCurrent.getComponent(cc.Label).string = this.scoreCurrentInt.toString();
    },

    addScore: function(score, position) {
        let scoreCell = this.spawnScoreCell();
        scoreCell.getComponent(cc.Label).string = score.toString();
        scoreCell.position = position;
        let targetPosition = this.scoreCurrent.position;

        let actionMove = cc.moveTo(0.8, targetPosition).easing(cc.easeCircleActionIn());
        let actionCallback = cc.callFunc(function() {
            this.scoreCurrentInt += score;
            this.scoreCurrent.getComponent(cc.Label).string = this.scoreCurrentInt.toString();
            this.scoreCurrent.getComponent(cc.Animation).play();
            this.despawnScoreCell(scoreCell);
        }, this)

        scoreCell.runAction(cc.sequence(actionMove, actionCallback));
    },

    addScoreTotal: function(score, position) {
        let scoreTotal = this.spawnScoreTotal();
        scoreTotal.position = position;
        scoreTotal.getComponentInChildren(cc.Label).string = score.toString();
        scoreTotal.getComponent(cc.Animation).play();
    },

    enableScoreBonus: function(score) {
        this.scoreBonus.getComponent(cc.Label).string = score.toString();
        this.scoreBonus.active = true;
        this.scoreBonus.opacity = 255;
    },

    setScoreBonus: function(score) {
        this.scoreBonus.getComponent(cc.Label).string = score.toString();
        this.scoreBonus.getComponent(cc.Animation).play();
    },

    disableScoreBonus: function() {
        let fadeAction = cc.fadeOut(1);
        let disactiveAction = cc.callFunc(function() {
            this.scoreBonus.active = false;
        }, this);
        this.scoreBonus.runAction(cc.sequence(fadeAction, disactiveAction));
    },

    spawnScoreCell: function() {
        let scoreCell = null;
        if (this.scoreCellPool.size() > 0) {
            scoreCell = this.scoreCellPool.get();
        } else {
            scoreCell = cc.instantiate(this.scoreCellPrefab);
        }

        scoreCell.setParent(this.scoreCellParent);
        return scoreCell;
    },

    despawnScoreCell: function(scoreCell) {
        this.scoreCellPool.put(scoreCell);
    },

    spawnScoreTotal: function() {
        let scoreTotal = null;
        if (this.scoreTotalPool.size() > 0) {
            scoreTotal = this.scoreTotalPool.get();
        } else {
            scoreTotal = cc.instantiate(this.scoreTotalPrefab);
            scoreTotal.getComponent(cc.Animation).on('finished', function(type, state){
                this.scoreTotalPool.put(scoreTotal);
            }, this);
        }

        scoreTotal.setParent(this.scoreTotalParent);
        return scoreTotal;
    },
});
