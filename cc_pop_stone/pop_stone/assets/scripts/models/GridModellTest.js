import GridModel from "./GridModel";

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        this.GridModel = new GridModel();
        this.GridModel.init(8, 10);
        this.GridModel.findAllElimination();
        this.GridModel.printInfo();
        let data = JSON.stringify(this.GridModel);
        console.log(data);
        this.GridModel = JSON.parse(data);
        console.log(JSON.stringify(this.GridModel));
    },
});
