import CellModel from "./CellModel";
import {BASE_TYPE, FEATURE_TYPE} from "./ConstValue";

var UtilsCommon = require('UtilsCommon');

export default function GridModel() {
    this.cells = null;
    this.width = 0;
    this.height = 0;
    this.baseTypeCount = 0;
}

GridModel.prototype.initFromJson = function(jsonObject) {
    this.width = jsonObject.width;
    this.height = jsonObject.height;
    this.baseTypeCount = jsonObject.baseTypeCount;

    this.cells = [];
    for (let y = 0; y < this.height; y++) {
        this.cells[y] = [];
        for (let x = 0; x < this.width; x++) {
            let cellFromJson = jsonObject.cells[y][x];
            if (cellFromJson != null) {
                let cell = new CellModel(cellFromJson);
                this.cells[y][x] = cell;
            } else {
                this.cells[y][x] = null;
            }
        }
    }
}

GridModel.prototype.init = function(width, height, colorCount, colorlessCount, clearCount) {
    this.debugLog("init: " + width + "x" + height);
    this.width = width;
    this.height = height;
    this.baseTypeCount = Object.keys(BASE_TYPE).length;

    this.cells = [];
    for (let y = 0; y < this.height; y++) {
        this.cells[y] = [];
        for (let x = 0; x < this.width; x++) {
            let cell = new CellModel();
            cell.baseType = this.getBaseTypeRandom();
            cell.setXY(x, y);
            this.cells[y][x] = cell;
        }
    }

    let cellFeatureIndexArray = [];

    let cellColor = new CellModel();
    cellColor.featureType = FEATURE_TYPE.Color;
    this.initCellsFeature(cellFeatureIndexArray, cellColor, colorCount);

    let cellColorless = new CellModel();
    cellColorless.featureType = FEATURE_TYPE.Colorless;
    cellColorless.baseType = this.getBaseTypeRandom();
    this.initCellsFeature(cellFeatureIndexArray, cellColorless, colorlessCount);

    let cellClear = new CellModel();
    cellClear.featureType = FEATURE_TYPE.Clear;
    this.initCellsClear(cellFeatureIndexArray, cellClear, clearCount);
}

GridModel.prototype.initCellsFeature = function(cellFeatureIndexArray, cellModel, cellCount) {
    let cellTotalCount = this.width * this.height;
    for (let i = 0; i < cellCount; i++) {
        let cellColorIndex = 0;
        do {
            cellColorIndex = Math.floor(Math.random() * cellTotalCount);
        } while(cellFeatureIndexArray.includes(cellColorIndex));
        cellFeatureIndexArray.push(cellColorIndex);

        let cellPos = {x: cellColorIndex % this.width, y: Math.floor(cellColorIndex / this.height)};
        this.setCell(cellPos, cellModel.clone());
    }
}

GridModel.prototype.initCellsClear = function(cellFeatureIndexArray, cellModel, cellCount) {
    let cellTotalCount = this.width * this.height;
    for (let i = 0; i < cellCount; i++) {
        let cellFeatureIndex = 0;
        let cellPos = {x: 0, y: 0};
        do {
            cellFeatureIndex = Math.floor(Math.random() * cellTotalCount);
            cellPos = {x: cellFeatureIndex % this.width, y: Math.floor(cellFeatureIndex / this.height)};
        } while(cellFeatureIndexArray.includes(cellFeatureIndex)
            || cellPos.y == 0
        );
        cellFeatureIndexArray.push(cellFeatureIndex);
        this.setCell(cellPos, cellModel.clone());
    }
}

//Stone clear落地爆炸
GridModel.prototype.checkClear = function() {
    let clearExplod = [];

    let y = 0;
    for (let x = 0; x < this.width; x++) {
        let cellPos = {"x": x, "y": y};
        let cell = this.getVaildCell(cellPos);
        if (cell != null
            && cell.featureType == FEATURE_TYPE.Clear
        ) {
            this.eliminateCell(cellPos);
            clearExplod.push(cellPos);
        }
    }

    return clearExplod;
}

//变色龙变色
GridModel.prototype.changeColorless = function(baseType) {
    let colorlessChange = {};
    colorlessChange.baseType = baseType;
    colorlessChange.cellPosArray = [];

    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            let cellPos = {"x": x, "y": y};
            let cell = this.getVaildCell(cellPos);

            if (cell != null
                && cell.featureType == FEATURE_TYPE.Colorless
            ) {
                cell.baseType = colorlessChange.baseType;
                colorlessChange.cellPosArray.push(cellPos);
            }
        }
    }

    return colorlessChange;
},

//找到所有可消除的数组
GridModel.prototype.checkElimination = function() {
    let allElimination = [];

    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            let cellPos = {"x": x, "y": y};
            //元素是否已经被之前的数组包含了
            let cellAlreadyContain = false;
            //从后往前遍历，后面新加的数组包含新元素的概率更大
            for (let i = allElimination.length - 1; i >= 0; i--) {
                if (this.checkCellPosInArray(cellPos, allElimination[i].cellPosArray)) {
                    cellAlreadyContain = true;
                    break;
                }
            }

            if (!cellAlreadyContain) {
                let elimination = this.findElimination(cellPos);
                if (elimination.cellPosArray.length >= 2) {
                    allElimination.push(elimination);
                }
            }
        }
    }

    return allElimination;
}

GridModel.prototype.onCellClick = function(cellPos) {
    let cell = this.getVaildCell(cellPos);

    let elimination = {};
    elimination.eliminateSuccess = false;

    if (cell != null) {
        if (cell.featureType == FEATURE_TYPE.Color) {
            elimination = this.onCellClickColor(cellPos);
        } else if (cell.baseType != BASE_TYPE.Empty) {
            elimination = this.onCellClickBaseType(cellPos);
        }
    }

    return elimination;
}

GridModel.prototype.onCellClickBaseType = function(cellPos) {
    let elimination = this.findElimination(cellPos);

    return this.eliminateElimination(elimination);
}

GridModel.prototype.onCellClickColor = function(cellPos) {
    let elimination = {};
    elimination.baseType = BASE_TYPE.Empty;
    elimination.cellPosArray = [cellPos];
    let arroundCellPos8 = this.getAroundCellPos8(cellPos);
    for (let i = 0; i < arroundCellPos8.length; i++) {
        let cellArround = this.getVaildCell(arroundCellPos8[i])

        if (cellArround != null
            && cellArround.featureType != FEATURE_TYPE.Clear
        ) {
            elimination.cellPosArray.push(cellArround.getXY())
        }
    }

    return this.eliminateElimination(elimination);
}

GridModel.prototype.onCellBrushed = function(cellPos) {
    let cellModelBrushedArray = [];
    let cellModel = this.getVaildCell(cellPos);
    if (cellModel != null) {
        let arroundCellPos8 = this.getAroundCellPos8(cellPos);
        for (let i = 0; i < arroundCellPos8.length; i++) {
            let cellArroundPos = arroundCellPos8[i];
            let cellArround = this.getVaildCell(cellArroundPos)
            if (cellArround != null) {
                let cellBrushed = cellModel.clone();
                this.setCell(cellArroundPos, cellBrushed);
                cellModelBrushedArray.push(cellBrushed);
            }
        }
    }

    return cellModelBrushedArray;
}

GridModel.prototype.onCellHammered = function(cellPos) {
    let cellModel = this.getVaildCell(cellPos);
    if (cellModel != null) {
        this.cells[cellPos.y][cellPos.x] = null;
    }

    let cellPosArray = [cellPos];
    return cellPosArray;
}

GridModel.prototype.onShuffle = function() {
    let shuffleRet = {};
    let originArray = [];
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            let cellPos = {'x': x, 'y': y};
            if (this.checkCellPosVaild(cellPos)) {
                let cellIndex = y * this.width + x;
                originArray.push(cellIndex);
            }
        }
    }
    shuffleRet.originArray = originArray;
    shuffleRet.processArrays = [];
    for (let i = 0; i < 3; i++) {
        let processArray = originArray.slice();
        UtilsCommon.shuffleArray(processArray);
        shuffleRet.processArrays.push(processArray);
    }

    let endArray = shuffleRet.processArrays[shuffleRet.processArrays.length - 1];

    let cellsShuffled = [];
    for (let y = 0; y < this.height; y++) {
        cellsShuffled[y] = [];
    }

    for (let i = 0; i < shuffleRet.originArray.length; i++) {
        let indexOrigin = shuffleRet.originArray[i];
        let cellPosOrigin = {'x': indexOrigin % this.width, 'y': Math.floor(indexOrigin / this.width)};
        let cellModelOrigin = this.getVaildCell(cellPosOrigin);
        
        let indexShuffled = endArray[i];
        let cellPosShuffled = {'x': indexShuffled % this.width, 'y': Math.floor(indexShuffled / this.width)};
        cellsShuffled[cellPosShuffled.y][cellPosShuffled.x] = cellModelOrigin;
        cellModelOrigin.setXY(cellPosShuffled.x, cellPosShuffled.y);
    }

    this.cells = cellsShuffled;

    return shuffleRet;
}

//消除数组
GridModel.prototype.eliminateElimination = function(elimination) {
    elimination.eliminateSuccess = false;
    if (elimination.cellPosArray.length >= 2) {
        elimination.eliminateSuccess = true;
        for (let i = 0; i < elimination.cellPosArray.length; i++) {
            let cellArroundPos = elimination.cellPosArray[i];
            this.eliminateCell(cellArroundPos);
        }
    } 

    return elimination;
}

//消除单个元素
GridModel.prototype.eliminateCell = function(cellPos) {
    this.cells[cellPos.y][cellPos.x] = null;
}

GridModel.prototype.clearCells = function() {
    let clearCells = [];
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            let cellPos = {'x':x, 'y':y};
            let cellMode = this.getVaildCell(cellPos);
            if (cellMode != null) {
                clearCells.push(cellMode);
                this.eliminateCell(cellPos);
            }
        }
    }

    return clearCells;
},

//元素下落
GridModel.prototype.cellsFallDown = function() {
    let cellFallArray = [];
    for (let x = 0; x < this.width; x++) {
        let emptyCount = 0; //当前元素下方的空格子数

        for (let y = 0; y < this.height; y++) {
            let cellPos = {'x': x, 'y': y};
            let cellMode = this.getVaildCell(cellPos);
            if (cellMode != null) {
                if (emptyCount > 0) {
                    let cellFall = {};
                    cellFall.pos = cellPos;
                    cellFall.fallCount = emptyCount;
                    cellFallArray.push(cellFall);

                    //下落
                    let fallDownY = y - emptyCount;
                    this.cells[y][x] = null;
                    this.cells[fallDownY][x] = cellMode;
                    cellMode.setXY(x, fallDownY);
                }
            } else {
                emptyCount += 1;
            }
        }
    }

    return cellFallArray;
}

//当一列全部消除时，两遍的元素往中间移，补上这一列
GridModel.prototype.cellsGather = function() {
    let centerX = Math.floor(this.width / 2) - 1; //中间列，大于此列，往左移，小于等于此列，往右移

    let cellGatherArray = [];
    //向右
    let emptyCount = 0;
    for (let x = centerX; x >= 0; x--) {
        if (!this.checkColumnEmpty(x)) {
            if (emptyCount > 0) {
                for (let y = 0; y < this.height; y++) {
                    let cellPos = {'x': x, 'y': y};
                    let cellMode = this.getVaildCell(cellPos);
                    if (cellMode != null) {
                        let cellGather = {};
                        cellGather.pos = cellPos;
                        cellGather.gatherCount = emptyCount;
                        cellGatherArray.push(cellGather);

                        //
                        let gatherX = x + cellGather.gatherCount;
                        this.cells[y][x] = null;
                        this.cells[y][gatherX] = cellMode;
                        cellMode.setXY(gatherX, y);
                    }
                }
            }
        } else {
            emptyCount += 1;
        }
    }

    //向左
    emptyCount = 0;
    for (let x = centerX + 1; x < this.width; x++) {
        if (!this.checkColumnEmpty(x)) {
            if (emptyCount > 0) {
                for (let y = 0; y < this.height; y++) {
                    let cellPos = {'x': x, 'y': y};
                    let cellMode = this.getVaildCell(cellPos);
                    if (cellMode != null) {
                        let cellGather = {};
                        cellGather.pos = cellPos;
                        cellGather.gatherCount = -emptyCount;
                        cellGatherArray.push(cellGather);

                        //
                        let gatherX = x + cellGather.gatherCount;
                        this.cells[y][x] = null;
                        this.cells[y][gatherX] = cellMode;
                        cellMode.setXY(gatherX, y);
                    }
                }
            }
        } else {
            emptyCount += 1;
        }
    }
    return cellGatherArray;
}

//检查x列是否整列为空
GridModel.prototype.checkColumnEmpty = function(x) {
    for (let y = 0; y < this.height; y++) {
        let cellPos = {'x': x, 'y': y};
        if (this.checkCellPosVaild(cellPos)) {
            return false;
        }
    }

    return true;
}

GridModel.prototype.findElimination = function(cellPos) {
    let elimination = {};
    elimination.baseType = BASE_TYPE.Empty;
    elimination.cellPosArray = [];

    let cell = this.getVaildCell(cellPos);
    if (cell != null
        && cell.baseType != BASE_TYPE.Empty
        && cell.featureType != FEATURE_TYPE.Color
        && cell.featureType != FEATURE_TYPE.Clear
    ) {
        elimination.baseType = cell.baseType;
        elimination.cellPosArray = [cellPos];
        this.findEliminationRecursive(cellPos, elimination);
    }

    return elimination;
}

//递归找到一个元素周围可消除的元素组
GridModel.prototype.findEliminationRecursive = function(cellPos, elimination) {
    let arroundCellPos4 = this.getAroundCellPos4(cellPos);
    for (let i = 0; i < arroundCellPos4.length; i++) {
        let cellArroundPos = arroundCellPos4[i];
        if (!this.checkCellPosInArray(cellArroundPos, elimination.cellPosArray)) {
            let cellArround = this.getVaildCell(cellArroundPos);
            if ((cellArround != null)
                && (cellArround.baseType == elimination.baseType || cellArround.featureType == FEATURE_TYPE.Color)
            ) {
                elimination.cellPosArray.push(cellArroundPos);
                this.findEliminationRecursive(cellArroundPos, elimination);
            }
        }
    }
}

//检查元素是否在数组内
GridModel.prototype.checkCellPosInArray = function(cellPos, cellPosArray) {
    for (let i = 0; i < cellPosArray.length; i++) {
        if (cellPos.x == cellPosArray[i].x && cellPos.y == cellPosArray[i].y) {
            return true;
        }
    }
    return false;
}

GridModel.prototype.getAroundCellPos8 = function(cellPos) {
    let arroundCellPos = [
        {x: cellPos.x - 1, y: cellPos.y + 1}, //左上
        {x: cellPos.x, y: cellPos.y + 1}, //上
        {x: cellPos.x + 1, y: cellPos.y + 1}, //右上
        {x: cellPos.x - 1, y: cellPos.y}, //左
        {x: cellPos.x + 1, y: cellPos.y}, //右
        {x: cellPos.x - 1, y: cellPos.y - 1}, //左下
        {x: cellPos.x, y: cellPos.y - 1}, //下
        {x: cellPos.x + 1, y: cellPos.y - 1} //右下
    ]

    return arroundCellPos;
}

//找到一个元素周围上下左右的四个元素
GridModel.prototype.getAroundCellPos4 = function(cellPos) {
    let arroundCellPos = [
        {x: cellPos.x, y: cellPos.y + 1},
        {x: cellPos.x, y: cellPos.y - 1},
        {x: cellPos.x - 1, y: cellPos.y},
        {x: cellPos.x + 1, y: cellPos.y}
    ]

    return arroundCellPos;
}

//过滤，返回数组中有效的元素
GridModel.prototype.filterVaildCellPos = function(cellPosArray) {
    let vaildCellPosArray = [];
    if (cellPosArray != null) {
        for (let i = 0; i < cellPosArray.length; i++) {
            let cellPos = cellPosArray[i];
            if (this.checkCellPosVaild(cellPos)) {
                vaildCellPosArray.push(cellPos);
            }
        }
    }

    return vaildCellPosArray;
}

//获取对应位置的cell
GridModel.prototype.getVaildCell = function(cellPos) {
    let vaildCell = null;
    if ((0 <= cellPos.x && cellPos.x < this.width)
        && (0 <= cellPos.y && cellPos.y < this.height)
    ) {
        let cell = this.cells[cellPos.y][cellPos.x];
        if (cell != null) {
            vaildCell = cell;
        }
    }

    return vaildCell;
}

GridModel.prototype.setCell = function(cellPos, cell) {
    cell.setXY(cellPos.x, cellPos.y);
    this.cells[cellPos.y][cellPos.x] = cell;
}

//检查这个位置是否有cell
GridModel.prototype.checkCellPosVaild = function(cellPos) {
    let vaildCell = this.getVaildCell(cellPos);
    return !!vaildCell;
}

GridModel.prototype.getBaseTypeRandom = function() {
    let baseType = Math.floor(Math.random() * (this.baseTypeCount - 1)) + 1;
    return baseType;
}

GridModel.prototype.printInfo = function(){
    let info = "";
    for(let y = this.height - 1; y >= 0; y--){
        info += "\n";
        for(let x = 0; x < this.width; x++){
            if (this.cells[y][x] == null) {
                info += "  ";
            } else {
                info += this.cells[y][x].baseType + " ";
            }
        }
    }
    console.log(info);
}

GridModel.prototype.debugLog = function(message) {
    console.log("[gm]" + message);
}