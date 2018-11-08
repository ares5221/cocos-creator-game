import GridModel from "./GridModel"
import * as ConstValue from "./ConstValue"

export function generateLevelInfo(level, score) {
    let levelConfigConst = {};
    if (level <= ConstValue.LEVEL_CONFIG.length) {
        levelConfigConst = ConstValue.LEVEL_CONFIG[level - 1];
    } else {
        levelConfigConst.level = level;
        levelConfigConst.target = (level - ConstValue.LEVEL_CONFIG.length) * 7000 + ConstValue.LEVEL_CONFIG[ConstValue.LEVEL_CONFIG.length - 1].target;
    }

    let levelConfig = {};
    levelConfig.level = levelConfigConst.level;
    levelConfig.target = levelConfigConst.target;
    levelConfig.score = score || 0;
    levelConfig.lastLevelScore = levelConfig.score;

    let colorCount = (typeof levelConfigConst.colorCount === 'undefined') ? Math.floor(Math.random() * 3) : levelConfigConst.colorCount;
    let colorLessCount = (typeof levelConfigConst.colorLessCount === 'undefined') ? Math.floor(Math.random() * 3) : levelConfigConst.colorLessCount;
    let clearCount = (typeof levelConfigConst.clearCount === 'undefined') ? Math.floor(Math.random() * 3) : levelConfigConst.clearCount;

    levelConfig.gridModel = new GridModel();
    levelConfig.gridModel.init(10, 10, colorCount, colorLessCount, clearCount);

    return levelConfig;
}

export function generateLevelInfoFromJson(levelInfoJsonStr) {
    let levelInfoJsonObject = JSON.parse(levelInfoJsonStr);
    
    let levelInfo = {};
    levelInfo.level = levelInfoJsonObject.level;
    levelInfo.target = levelInfoJsonObject.target;
    levelInfo.score = levelInfoJsonObject.score;
    levelInfo.lastLevelScore = levelInfoJsonObject.lastLevelScore;
    levelInfo.gridModel = new GridModel();
    levelInfo.gridModel.initFromJson(levelInfoJsonObject.gridModel);

    return levelInfo;
}