import * as ConstValue from "../models/ConstValue";
import GridModel from "../models/GridModel"
import * as LevelModel from "../models/LevelModel"

var UtilsCommon = require("UtilsCommon");
var UtilsFB = require("UtilsFB");
var ScoreView = require("ScoreView");
var UserDataMgr = require("UserDataMgr");
var ScreenMgr = require("ScreenMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        cellViewPrefab: {
            default: null,
            type: cc.Prefab,
        },

        cellParent: {
            default: null,
            type: cc.Node,
        },

        effectView: {
            default: null,
            type: require('EffectView'),
        },

        nodeLevel: {
            default: null,
            type: cc.Node,
        },

        nodeKeepGoing: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function() {
        this.screenGame = require('ScreenGame');

        this.gaming = false;
        this.cellViewPool = new cc.NodePool("CellView");
        this.cellViews = [];
        this.allElimination = [];
        this.touchCellView = null;

        //无操作时长，大于一定时间，显示提示
        this.noTouchTime = 0;
        this.hintHighlighting = false;

        this.busying = false;

        this.lastExplodBaseType = ConstValue.BASE_TYPE.Empty;

        this.brushSelected = false;
        this.hammerSelected = false;
    },

    update: function(dt) {
        this.noTouchTime += dt;

        if (this.busying) {
            this.noTouchTime = 0;
        }

        if (!this.hintHighlighting
            && this.gaming
            && this.noTouchTime > 5
        ) {
            this.highlightElimination();
        } 
    },

    clearOnExit() {
        for (let y = 0; y < this.gridModel.height; y++) {
            for (let x = 0; x < this.gridModel.width; x++) {
                let cellView = this.cellViews[y][x];
                if (cellView != null) {
                    this.despawnCellView(cellView);
                }
            }
        }

        this.gaming = false;
        this.allElimination = false;
        this.stopHighlightElimination();
    },

    initWithLevelInfo: function(levelInfo) {
        this.lastLevelScore = levelInfo.lastLevelScore;
        this.level = levelInfo.level;
        this.score = levelInfo.score;
        this.target = levelInfo.target;
        this.gridModel = levelInfo.gridModel;

        ScoreView.instance.initWithLevelInfo(levelInfo);

        this.cellViews = [];
        for (let y = 0; y < this.gridModel.height; y++) {
            this.cellViews[y] = [];
            for (let x = 0; x < this.gridModel.width; x++) {
                let cellPos = {"x": x, "y": y};
                let cellModel = this.gridModel.getVaildCell(cellPos);
                if (cellModel != null) {
                    let cellView = this.spawnCellView();
                    cellView.node.setParent(this.cellParent);
                    cellView.node.position = this.getCellPosition(cellPos);
                    cellView.initWithCellModel(cellModel);
                    this.cellViews[y][x] = cellView;
                }
            }
        }

        this.animationGameStart();
    },

    animationGameStart: function() {
        let arrayShuffleIndex = Array.from(Array(this.gridModel.width * this.gridModel.height).keys());
        arrayShuffleIndex = UtilsCommon.shuffleArray(arrayShuffleIndex);
        for (let y = 0; y < this.gridModel.height; y++) {
            for (let x = 0; x < this.gridModel.width; x++) {
                let index = y * this.gridModel.width + x;
                let shuffleIndex = arrayShuffleIndex[index];

                let cellView = this.cellViews[y][x];
                if (cellView != null) {
                    let beginPos = {x: shuffleIndex % this.gridModel.width, y: Math.floor(shuffleIndex / this.gridModel.width)};
                    let beginPosition = this.getCellPosition(beginPos).mul(0.8).add(cc.v2(0, 600)).scale(cc.v2(-1, 1))
                    cellView.setPosition(beginPosition);
                    cellView.setScale(0.8);
                    cellView.setOpacity(0);
                }
            }
        }

        let animationActionArray = [];
        for (let y = 0; y < this.gridModel.height; y++) {
            let cellCount = 0;
            for (let x = 0; x < this.gridModel.width; x++) {
                if (this.cellViews[y][x]) {
                    cellCount += 1;
                }
            }

            if (cellCount > 0) {
                let animationActionColumn = cc.callFunc(function() {
                    for (let x = 0; x < this.gridModel.width; x++) {
                        let cellPos = {"x":x, "y":y};
                        let cellView = this.cellViews[y][x];
                        if (cellView != null) {
                            let cellPosition = this.getCellPosition(cellPos);
                            let moveTime = 0.5;
                            let moveAction = cc.moveTo(moveTime, cellPosition).easing(cc.easeIn(3));
                            let scaleAction = cc.scaleTo(moveTime, 1).easing(cc.easeIn(3));
                            let fadeAction = cc.fadeIn(moveTime).easing(cc.easeIn(3));

                            let moveToOriginAction = cc.spawn(moveAction, scaleAction, fadeAction);
                            cellView.runActionMove(moveToOriginAction);
                        }
                    }
                }, this);
                animationActionArray.push(cc.delayTime(0.2));
                animationActionArray.push(animationActionColumn);
            }
        }

        let animationFinished = cc.callFunc(this.gameStart, this);
        animationActionArray.push(animationFinished);

        this.busying = true;
        this.node.runAction(cc.sequence(animationActionArray));
    },

    gameStart() {
        // this.screenGame.instance.updateItemInfo();
        this.busying = false;
        this.gaming = true;
        this.checkElimination();
        this.noTouchTime = 0;
    },

    checkElimination: function() {
        this.allElimination = this.gridModel.checkElimination();

        if (this.allElimination.length <= 0) {
            this.bonusClearCells();
        }

        return this.allElimination.length > 0;
    },

    highlightElimination: function() {
        if (this.allElimination.length > 0) {
            let index = Math.floor(Math.random() * this.allElimination.length);
            let elimination = this.allElimination[index];

            let positionArray = [];
            for (let i = 0; i < elimination.cellPosArray.length; i++) {
                let cellPos = elimination.cellPosArray[i];
                positionArray.push(this.getCellPosition(cellPos));
            }
            this.effectView.playEffectLoop(ConstValue.EFFECT_SELECTED, positionArray);
            this.hintHighlighting = true;
        }
    },

    stopHighlightElimination: function() {
        this.effectView.stopEffectLoop(ConstValue.EFFECT_SELECTED);
        this.hintHighlighting = false;
    },

    getCellPosition: function(cellPos) {
        let postionX = (cellPos.x - (this.gridModel.width - 1) / 2) * ConstValue.CELL_WIDTH;
        let postionY = (cellPos.y - (this.gridModel.height - 1) / 2) * ConstValue.CELL_HEIGHT;
        return cc.v2(postionX, postionY);
    },

    spawnCellView: function() {
        let cellViewNode = null;
        if (this.cellViewPool.size() > 0) {
            cellViewNode = this.cellViewPool.get();
        } else {
            cellViewNode = cc.instantiate(this.cellViewPrefab);
        }

        return cellViewNode.getComponent('CellView');
    },

    despawnCellView: function(cellView) {
        this.cellViewPool.put(cellView.node);
    },

    onTouchStart: function(touchPosition) {
        if (this.busying) {
            return;
        }
        let cellPos = this.convertToCellPos(touchPosition);

        if (this.gridModel.checkCellPosVaild(cellPos)) {
            this.touchCellView = this.cellViews[cellPos.y][cellPos.x];
            if (this.touchCellView != null) {
                this.touchCellView.node.scale = 0.9;
            }
        }
    },

    onTouchEnd: function(touchPosition) {
        if (this.touchCellView != null) {
            this.touchCellView.node.scale = 1;

            let cellPos = this.convertToCellPos(touchPosition);
            if (cellPos.x == this.touchCellView.cellModel.x && cellPos.y == this.touchCellView.cellModel.y) {
                this.stopHighlightElimination();
                if (this.brushSelected) {
                    this.onCellBrushed(cellPos);
                } else if (this.hammerSelected) {
                    this.onCellHammered(cellPos);
                } else {
                    this.onCellClick(cellPos);
                }
            }
        }
    },

    convertToCellPos: function(positionWorld) {
        let touchPositionLocal = this.cellParent.convertToNodeSpace(positionWorld);
        let posX = Math.round(touchPositionLocal.x / ConstValue.CELL_WIDTH + (this.gridModel.width - 1) / 2);
        let posY = Math.round(touchPositionLocal.y / ConstValue.CELL_HEIGHT + (this.gridModel.height - 1) / 2);
        let cellPos = {x: posX, y: posY};

        return cellPos;
    },

    cellSortCompare: function(cellPos1, cellPos2) {
        if (cellPos1.y < cellPos2.y) {
            return 1;
        } else if (cellPos1.y > cellPos2.y) {
            return -1;
        } else {
            if (cellPos1.x > cellPos2.x) {
                return 1;
            } else if (cellPos1.x < cellPos2.x) {
                return -1;
            } else {
                return 0;
            }
        }
    },

    onCellClick: function(cellPos) {
        let elimination = this.gridModel.onCellClick(cellPos);

        if (elimination.eliminateSuccess) {
            let scoreCell = 5 * elimination.cellPosArray.length;
            let scoreTotal = scoreCell * elimination.cellPosArray.length;
            this.score += scoreTotal;

            this.lastExplodBaseType = elimination.baseType;
            this.busying = true;
            
            elimination.cellPosArray.sort(this.cellSortCompare);

            let explodActionArray = [];
            for (let i = 0; i < elimination.cellPosArray.length; i++) {
                let cellPos = elimination.cellPosArray[i]
                let cellExplod = this.cellViews[cellPos.y][cellPos.x];
                if (cellExplod != null) {
                    this.cellViews[cellPos.y][cellPos.x] = null;

                    let explodAction = cc.callFunc(function () {
                        this.despawnCellView(cellExplod);

                        let cellModel = cellExplod.cellModel;
                        let effectPosition = this.getCellPosition(cellPos);
                        if (cellModel.featureType == ConstValue.FEATURE_TYPE.Color) {
                            this.effectView.playEffectNormal(ConstValue.EFFECT_EXPLOD_COLOR, effectPosition);
                        } else if (cellModel.baseType != ConstValue.BASE_TYPE.Empty) {
                            this.effectView.playEffectExplod(cellModel.baseType - 1, effectPosition);
                        }

                        ScoreView.instance.addScore(scoreCell, effectPosition);
                    }, this);
                    explodActionArray.push(cc.delayTime(0.07));
                    explodActionArray.push(explodAction);
                }
            }

            let addScoreTotalAction = cc.callFunc(function() {
                let cellPosStart = elimination.cellPosArray[0];
                let cellPosEnd = elimination.cellPosArray[elimination.cellPosArray.length - 1];
                let cellPositionStart = this.getCellPosition(cellPosStart);
                let cellpositionEnd = this.getCellPosition(cellPosEnd);
                let scoreTotalPosition = cellPositionStart.add(cellpositionEnd).div(2);
                //边缘位置
                let positionMaxX = Math.abs(this.getCellPosition({'x': 1, "y": 0}).x);
                if (Math.abs(scoreTotalPosition.x) > positionMaxX) {
                    scoreTotalPosition.x = positionMaxX * Math.sign(scoreTotalPosition.x);
                }
                ScoreView.instance.addScoreTotal(scoreTotal, scoreTotalPosition);
            }, this);
            explodActionArray.push(addScoreTotalAction);

            let onExplodFinished = cc.callFunc(this.onExplodFinished, this);
            explodActionArray.push(onExplodFinished);

            this.node.runAction(cc.sequence(explodActionArray));
        }
    },

    onExplodFinished: function() {
        this.busying = false;
        this.cellsFallDown();
    },

    cellsFallDown: function() {
        this.busying = true;
        let cellFallArray = this.gridModel.cellsFallDown();
        let fallDownTime = 0;
        if (cellFallArray.length > 0) {
            fallDownTime = 0.2;

            for (let i = 0; i < cellFallArray.length; i++) {
                let cellFall = cellFallArray[i];
                let cellView = this.cellViews[cellFall.pos.y][cellFall.pos.x];
                if (cellView != null) {
                    this.cellViews[cellFall.pos.y][cellFall.pos.x] = null;
                    let fallDownPos = {x: cellFall.pos.x, y: cellFall.pos.y - cellFall.fallCount};
                    this.cellViews[fallDownPos.y][fallDownPos.x] = cellView;

                    let fallDownPosition = this.getCellPosition(fallDownPos);

                    let fallDownAction = cc.moveTo(fallDownTime, fallDownPosition).easing(cc.easeBackIn());
                    cellView.runActionMove(fallDownAction);
                }
            }
        }

        this.scheduleOnce(this.onFallDownFinished, fallDownTime);
    },

    onFallDownFinished: function() {
        this.busying = false;
        this.cellsGather();
    },

    cellsGather: function() {
        this.busying = true;
        let cellGatherArray = this.gridModel.cellsGather();
        let gatherTime = 0;
        if (cellGatherArray.length > 0) {
            gatherTime = 0.2;

            for (let i = 0; i < cellGatherArray.length; i++) {
                let cellGather = cellGatherArray[i];
                let cellView = this.cellViews[cellGather.pos.y][cellGather.pos.x];
                if (cellView != null) {
                    this.cellViews[cellGather.pos.y][cellGather.pos.x] = null;
                    let gatherPos = {x: cellGather.pos.x + cellGather.gatherCount, y: cellGather.pos.y};
                    this.cellViews[gatherPos.y][gatherPos.x] = cellView;

                    let gatherPosition = this.getCellPosition(gatherPos);

                    let gatherAction = cc.moveTo(gatherTime, gatherPosition).easing(cc.easeBackIn());
                    cellView.runActionMove(gatherAction);
                }
            }
        }

        this.scheduleOnce(this.onGatherFinished, gatherTime);
    },

    onGatherFinished: function() {
        this.busying = false;

        this.changeColorless();
        this.checkClear();
    },

    checkClear: function() {
        let clearExplod = this.gridModel.checkClear();
        this.busying = true;
        let explodActionArray = [];
        let clearExploded = false;
        let scoreCell = 1000;
        if (clearExplod.length > 0) {
            clearExploded = true;
            for (let i = 0; i < clearExplod.length; i++) {
                let cellPos = clearExplod[i];
                let cellView = this.cellViews[cellPos.y][cellPos.x];
                if (cellView != null) {
                    let explodAction = cc.callFunc(function () {
                        this.despawnCellView(cellView);

                        let effectPosition = this.getCellPosition(cellPos);
                        this.effectView.playEffectNormal(ConstValue.EFFECT_EXPLOD_COLOR, effectPosition);

                        ScoreView.instance.addScore(scoreCell, effectPosition);
                    }, this);
                    explodActionArray.push(cc.delayTime(0.1));
                    explodActionArray.push(explodAction);
                }
            }

            let scoreTotal = scoreCell * clearExplod.length;

            this.score += scoreTotal;

            let cellPosStart = clearExplod[0];
            let cellPosEnd = clearExplod[clearExplod.length - 1];
            let cellPositionStart = this.getCellPosition(cellPosStart);
            let cellpositionEnd = this.getCellPosition(cellPosEnd);
            let scoreTotalPosition = cellPositionStart.add(cellpositionEnd).div(2);

            //边缘位置
            let positionMaxX = Math.abs(this.getCellPosition({'x': 2, "y": 0}).x);
            if (Math.abs(scoreTotalPosition.x) > positionMaxX) {
                scoreTotalPosition.x = positionMaxX * Math.sign(scoreTotalPosition.x);
            }

            let addScoreTotalAction = cc.callFunc(function() {
                ScoreView.instance.addScoreTotal(scoreTotal, scoreTotalPosition);
            }, this);
            explodActionArray.push(addScoreTotalAction);
        }

        let onExplodFinished = cc.callFunc(this.onClearExplodFinished, this, clearExploded);
        if (explodActionArray.length > 0) {
            explodActionArray.push(onExplodFinished);
            this.node.runAction(cc.sequence(explodActionArray));
        } else {
            this.node.runAction(onExplodFinished);
        }
    },

    onClearExplodFinished: function(target, clearExploded) {
        this.busying = false;
        if (clearExploded) {
            this.cellsFallDown();
        } else {
            this.checkElimination();
        }
    },

    changeColorless: function() {
        if (this.lastExplodBaseType != ConstValue.BASE_TYPE.Empty) {
            let colorlessChange = this.gridModel.changeColorless(this.lastExplodBaseType);
            if (colorlessChange.cellPosArray.length > 0) {
                for (let i = 0; i < colorlessChange.cellPosArray.length; i++) {
                    let cellPos = colorlessChange.cellPosArray[i];
                    let cellView = this.cellViews[cellPos.y][cellPos.x];
                    if (cellView != null) {
                        cellView.changeBaseType(colorlessChange.baseType);
                    }
                }
            }
        }
    },

    bonusClearCells: function() {
        this.busying = true;

        let clearCells = this.gridModel.clearCells();
        let bonusScore = 2000;
        let cellScore = 200;
        let addScore = Math.max(0, bonusScore - clearCells.length * cellScore);
        this.score += addScore;

        ScoreView.instance.enableScoreBonus(bonusScore);

        let bonusActionArray = [];
        if (clearCells.length > 0) {
            clearCells.sort(this.cellSortCompare);

            //延迟1s开始
            bonusActionArray.push(cc.delayTime(1));

            for (let i = 0; i < clearCells.length; i++) {
                let cellPos = clearCells[i];
                let cellView = this.cellViews[cellPos.y][cellPos.x];
                if (cellView != null) {
                    let clearCellAction = cc.callFunc(function() {
                        let cellModel = cellView.cellModel;
                        let effectPosition = this.getCellPosition(cellPos);
                        if (cellModel.featureType == ConstValue.FEATURE_TYPE.Color
                            || cellModel.featureType == ConstValue.FEATURE_TYPE.Clear
                        ) {
                            this.effectView.playEffectNormal(ConstValue.EFFECT_EXPLOD_COLOR, effectPosition);
                        } else if (cellModel.baseType != ConstValue.BASE_TYPE.Empty) {
                            this.effectView.playEffectExplod(cellModel.baseType - 1, effectPosition);
                        }

                        this.despawnCellView(cellView);

                        if (bonusScore > 0) {
                            bonusScore = bonusScore - cellScore;
                            if (bonusScore <= 0) {
                                bonusScore = 0;
                                ScoreView.instance.disableScoreBonus();
                            }
                            ScoreView.instance.setScoreBonus(bonusScore);
                        }
                    }, this)

                    let delayTime = i < (bonusScore / cellScore) ? 0.3: 0.1;
                    bonusActionArray.push(cc.delayTime(delayTime));
                    bonusActionArray.push(clearCellAction);
                }
            }
        }

        if (addScore > 0) {
            let addScoreAction = cc.callFunc(function() {
                let addScorePosition = this.getCellPosition({'x': this.gridModel.width / 2, 'y': this.gridModel.height / 2});
                ScoreView.instance.addScore(addScore, addScorePosition);
                ScoreView.instance.disableScoreBonus();
            }, this);
            bonusActionArray.push(addScoreAction);
        }

        let onBonusFinished = cc.callFunc(this.onBonusFinished, this);
        if (bonusActionArray.length > 0) {
            bonusActionArray.push(onBonusFinished);
            this.node.runAction(cc.sequence(bonusActionArray));
        } else {
            this.node.runAction(onBonusFinished);
        }
    },

    onBonusFinished: function() {
        this.busying = false;
        if (this.score >= this.target) {
            this.onNextLevel();
        } else {
            this.onGameOver();
        }
    },

    onGameOver: function() {
        //第一关失败时，直接失败
        if (this.level <= 1) {
            this.onGameOverFinal();
        } else {
            //其他关失败时，有复活的机会
            this.nodeKeepGoing.active = true;
        }
    },

    onNextLevel: function() {
        let nextLevel = this.level + 1;
        let levelInfo = LevelModel.generateLevelInfo(nextLevel, this.score);
        this.initWithLevelInfo(levelInfo);
    },

    onBtnClickRevive: function() {
        var imageBase64 = UtilsCommon.getScreenshotBase64(UtilsCommon.getCameraMain());
        UtilsFB.chooseAsync(imageBase64)
        .then(function() {
            this.onGameRevive();
        }.bind(this))
        .catch(error =>{});
    },

    //游戏复活
    onGameRevive: function() {
        this.nodeKeepGoing.active = false;
        let nextLevel = this.level;
        let levelInfo = LevelModel.generateLevelInfo(nextLevel, this.lastLevelScore)
        this.initWithLevelInfo(levelInfo);
    },

    //拒绝复活，游戏失败
    onGameReviveReject: function() {
        this.onGameOverFinal();
    },

    //游戏最终失败
    onGameOverFinal: function() {
        this.nodeKeepGoing.active = false;

        let diamondAddCount = this.level;
        UserDataMgr.instance.incrementData(ConstValue.ITEM_DIAMOND, diamondAddCount);
        UserDataMgr.instance.setData(ConstValue.DATA_LEVEL_INFO, "");
        UserDataMgr.instance.setDataToFB();

        UtilsFB.setLeaderboardAsync(ConstValue.LEADERBOARD_SCORE_WORLD, this.score);

        let args = {"diamond": diamondAddCount, "score": this.score};
        ScreenMgr.instance.gotoScreen("ScreenGameOver", args);
    },

    onCellBrushed(cellPos) {
        let cellModelBrushedArray = this.gridModel.onCellBrushed(cellPos);
        if (cellModelBrushedArray.length > 0) {
            for (let i = 0; i < cellModelBrushedArray.length; i++) {
                let cellModelBrushed = cellModelBrushedArray[i];
                let cellPosBrushed = cellModelBrushed.getXY();
                let cellViewBrushed = this.cellViews[cellPosBrushed.y][cellPosBrushed.x];
                if (cellViewBrushed != null) {
                    this.despawnCellView(cellViewBrushed);
                    let cellViewNew = this.spawnCellView();
                    cellViewNew.node.setParent(this.cellParent);
                    cellViewNew.node.position = this.getCellPosition(cellPosBrushed);
                    cellViewNew.initWithCellModel(cellModelBrushed);
                    this.cellViews[cellPosBrushed.y][cellPosBrushed.x] = cellViewNew;
                }
            }
        }

        this.screenGame.instance.cancelBtnBrush();
        this.effectView.playEffectNormal(ConstValue.EFFECT_BRUSH, this.getCellPosition(cellPos));
        this.stopHighlightElimination();
        this.checkElimination();
        this.noTouchTime = 0;

        this.onUseItem(ConstValue.ITEM_BRUSH, ConstValue.PRICE_BRUSH);
    },

    onShuffle() {
        this.busying = true;
        this.stopHighlightElimination();

        let shuffleRet = this.gridModel.onShuffle();

        let cellViewsNew = [];
        for (let y = 0; y < this.gridModel.height; y++) {
            cellViewsNew[y] = [];
        }

        let moveTime = 0.3;
        let delayTime = 0.2;

        for (let i = 0; i < shuffleRet.originArray.length; i++) {
            let indexOrigin = shuffleRet.originArray[i];
            let cellPosOrigin = {'x': indexOrigin % this.gridModel.width, 'y': Math.floor(indexOrigin / this.gridModel.width)};
            let cellView = this.cellViews[cellPosOrigin.y][cellPosOrigin.x];
            if (cellView != null) {
                let cellMoveActionArray = [];
                for (let j = 0; j < shuffleRet.processArrays.length; j++) {
                    let processArray = shuffleRet.processArrays[j]
                    let indexProcess = processArray[i];
                    let cellPosProcess = {'x': indexProcess % this.gridModel.width, 'y': Math.floor(indexProcess / this.gridModel.width)};

                    if (j == shuffleRet.processArrays.length - 1) {
                        cellViewsNew[cellPosProcess.y][cellPosProcess.x] = cellView;
                    }

                    let moveAction = cc.moveTo(moveTime, this.getCellPosition(cellPosProcess));
                    cellMoveActionArray.push(cc.delayTime(delayTime));
                    cellMoveActionArray.push(moveAction);
                }

                cellView.runActionMove(cc.sequence(cellMoveActionArray));
            }
        }

        this.cellViews = cellViewsNew;

        let shuffleDoneTime = (moveTime + delayTime) * shuffleRet.processArrays.length;
        this.scheduleOnce(this.onShuffleDone, shuffleDoneTime);

        this.onUseItem(ConstValue.ITEM_SHUFFLE, ConstValue.PRICE_SHUFFLE);
    },

    onShuffleDone() {
        this.busying = false;
        this.checkElimination();
    },

    onCellHammered(cellPos) {
        let cellPosArray = this.gridModel.onCellHammered(cellPos);

        this.screenGame.instance.cancelBtnHammer();
        this.effectView.playEffectNormal(ConstValue.EFFECT_HAMMER, this.getCellPosition(cellPos));

        let explodActionArray = [];
        explodActionArray.push(cc.delayTime(0.5));

        for (let i = 0; i < cellPosArray.length; i++) {
            let cellPosExplod = cellPosArray[i];
            let cellView = this.cellViews[cellPosExplod.y][cellPosExplod.x];
            if (cellView != null) {
                let expldeAction = cc.callFunc(function() {
                    this.despawnCellView(cellView);

                    let cellModel = cellView.cellModel;
                    let effectPosition = this.getCellPosition(cellPosExplod);
                    if (cellModel.featureType == ConstValue.FEATURE_TYPE.Color
                        || cellModel.featureType == ConstValue.FEATURE_TYPE.Clear
                    ) {
                        this.effectView.playEffectNormal(ConstValue.EFFECT_EXPLOD_COLOR, effectPosition);
                    } else if (cellModel.baseType != ConstValue.BASE_TYPE.Empty) {
                        this.effectView.playEffectExplod(cellModel.baseType - 1, effectPosition);
                    }
                }, this);

                explodActionArray.push(expldeAction);
            }
        }

        let onCellHammerDone = cc.callFunc(this.onCellHammerDone, this);
        explodActionArray.push(onCellHammerDone);

        this.node.runAction(cc.sequence(explodActionArray));

        this.onUseItem(ConstValue.ITEM_HAMMER, ConstValue.PRICE_HAMMER);
    },

    onCellHammerDone() {
        this.busying = false;
        this.cellsFallDown();
    },

    onUseItem(itemName, itemPrice) {
        if (UserDataMgr.instance.getDataNumber(itemName) > 0) {
            UserDataMgr.instance.decrementData(itemName, 1);
        } else if (UserDataMgr.instance.getDataNumber(ConstValue.ITEM_DIAMOND) >= itemPrice) {
            UserDataMgr.instance.decrementData(ConstValue.ITEM_DIAMOND, itemPrice);
        }

        UserDataMgr.instance.setDataToFB();
    },

    saveLevelInfo() {
        let levelInfo = {};
        levelInfo.level = this.level;
        levelInfo.lastLevelScore = this.lastLevelScore;
        levelInfo.score = this.score;
        levelInfo.target = this.target;
        levelInfo.gridModel = this.gridModel;

        let levelInfoStr = JSON.stringify(levelInfo);
        UserDataMgr.instance.setData(ConstValue.DATA_LEVEL_INFO, levelInfoStr);
        UserDataMgr.instance.setDataToFB();
    },
});
