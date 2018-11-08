//基础类型
export const BASE_TYPE = {
    Empty : 0,
    Red : 1,
    Yellow : 2,
    Blue : 3,
    Green : 4,
    Pink : 5,
}

//功能类型
export const FEATURE_TYPE = {
    Empty : 0,
    Color : 1,//万能型
    Colorless : 2,//变色龙
    Clear : 3,//落地爆炸
}

export const CELL_WIDTH = 72;
export const CELL_HEIGHT = 72;

export const EFFECT_SELECTED = "EffectSelected";
export const EFFECT_COLOR = "EffectColor";
export const EFFECT_COLORLESS = "EffectColorless";
export const EFFECT_COLORLESS_CHANGE = "EffectColorlessChange";
export const EFFECT_EXPLOD_COLOR = "EffectExplodColor";
export const EFFECT_BRUSH = "EffectBrush";
export const EFFECT_HAMMER = "EffectHammer";

export const ITEM_BRUSH = "ItemBrush";
export const ITEM_HAMMER = "ItemHammer";
export const ITEM_SHUFFLE = "ItemShuffle";
export const ITEM_DIAMOND = "ItemDiamond";
export const PRICE_BRUSH = 100;
export const PRICE_HAMMER = 50;
export const PRICE_SHUFFLE = 50;

export const DATA_LAST_DIAMOND_DATE = "DataLastDiamondDate";
export const DATA_LAST_DIAMOND_COUNT = "DataLastDiamondCount";
export const DAILY_DIAMOND_COUNT = 3;

export const DATA_LAST_GIFT_DATE = "DataLastGiftDate";
export const DATA_LAST_GIFT_COUNT = "DataLastGiftCount";
export const DATA_GIFT_COUNT = 1;

export const DATA_LEVEL_INFO = "DataLevelInfo";

export const LEADERBOARD_SCORE_WORLD = "ScoreWorld";

export const LEVEL_CONFIG = [{
    level: 1,
    target: 1200,
    colorCount: 1,
    colorLessCount: 0,
    clearCount: 0,
},
{
    level: 2,
    target: 3E3,
    colorCount: 1,
    colorLessCount: 2,
    clearCount: 0,
},
{
    level: 3,
    target: 5E3,
    clearCount: 2,
},
{
    level: 4,
    target: 7500,
},
{
    level: 5,
    target: 1E4,
},
{
    level: 6,
    target: 12500,
},
{
    level: 7,
    target: 15E3,
},
{
    level: 8,
    target: 18E3,
},
{
    level: 9,
    target: 2E4,
},
{
    level: 10,
    target: 22E3,
}];

export function generateLevelInfo(level, score) {
    let levelConfig = {};
    levelConfig.score = score || 0;
    if (level <= ConstValue.LEVEL_CONFIG.length) {
        levelConfig.level = ConstValue.LEVEL_CONFIG[level - 1].level;
        levelConfig.target = ConstValue.LEVEL_CONFIG[level - 1].target;
    } else {
        levelConfig.level = level;
        levelConfig.target = (level - ConstValue.LEVEL_CONFIG.length) * 5000 + ConstValue.LEVEL_CONFIG[ConstValue.LEVEL_CONFIG.length - 1].target;
    }

    let colorCount = Math.floor(Math.random() * 3);
    let colorLessCount = Math.floor(Math.random() * 3);
    let clearCount = Math.floor(Math.random() * 3);
    levelConfig.girdModel = new GridModel();
    levelConfig.girdModel.init(10, 10, colorCount, colorLessCount, clearCount);
}