import { BASE_TYPE, FEATURE_TYPE } from "./ConstValue";

export default function CellModel(jsonObject) {
    this.baseType = BASE_TYPE.Empty;
    this.featureType = FEATURE_TYPE.Empty;
    this.x = 0;
    this.y = 0;

    if (jsonObject) {
        this.baseType = jsonObject.baseType;
        this.featureType = jsonObject.featureType
        this.x = jsonObject.x;
        this.y = jsonObject.y;
    }
}

CellModel.prototype.init = function(baseType) {
    this.baseType = type;
}

CellModel.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
}

CellModel.prototype.getXY = function() {
    return {x: this.x, y: this.y};
}

CellModel.prototype.clone = function() {
    let cellClone = new CellModel();
    cellClone.baseType = this.baseType;
    cellClone.featureType = this.featureType;
    cellClone.x = this.x;
    cellClone.y = this.y;

    return cellClone;
}