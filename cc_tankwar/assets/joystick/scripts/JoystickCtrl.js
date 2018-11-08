
var TouchType = cc.Enum({
    DEFAULT: 0,
    FOLLOW: 1
});

var DirectionType = cc.Enum({
    FOUR: 0,
    EIGHT: 1,
    ALL: 2
});

cc.Class({
    extends: cc.Component,

    properties: {
        joystickBar: {
            default: null,
            type: cc.Node
        },//控杆
        joystickBG: {
            default: null,
            type: cc.Node
        },//控杆背景
        radius: 0, //半径
        touchType: {
            default: TouchType.DEFAULT, //触摸类型
            type: TouchType
        },
        directionType: {
            default: DirectionType.ALL,  //方向类型
            type: DirectionType
        },
        //当前角度
        curAngle: {
            default: 0,
            visible: false
        },
        //当前距离
        distance: {
            default: 0,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function () {
        if(this.radius == 0){
            this.radius = this.joystickBG.width/2
        }
        this.registerInput()
        this.distance = 0
        this.curAngle = 0
        this.initPos = this.node.position
        
        this.node.opacity = 50

    },

    addJoyStickTouchChangeListener: function(callback) {
        this.angleChange = callback;
    },

    registerInput: function() {
        var self = this;
        // touch input
        this._listener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                return self.onTouchBegan(touch, event)
            },
            onTouchMoved: function(touch, event) {
                self.onTouchMoved(touch, event)
            },
            onTouchEnded: function(touch, event) {
                self.onTouchEnded(touch, event)
            }
        }, self.node);
    },


    onTouchBegan: function(touch, event) {

        //如果触摸类型为FOLLOW，则摇控杆的位置为触摸位置,触摸开始时候现形
        if(this.touchType == TouchType.FOLLOW)
        {
            var touchPos = this.node.parent.convertToNodeSpaceAR(touch.getLocation())
            this.node.setPosition(touchPos);
            return true;
        }
        else
        {                    
            //把触摸点坐标转换为相对与目标的模型坐标
            var touchPos = this.node.convertToNodeSpaceAR(touch.getLocation())
            //点与圆心的距离
            var distance = cc.pDistance(touchPos, cc.p(0, 0));
            //如果点与圆心距离小于圆的半径,返回true
            if(distance < this.radius ) {
                if(distance>20){
                    this.node.opacity = 255
                    this.joystickBar.setPosition(touchPos);
                    //更新角度
                    this._getAngle(touchPos)
                }
                return true;
            }
        }
        return false;
    },

    onTouchMoved: function(touch, event) {
                                
        //把触摸点坐标转换为相对与目标的模型坐标
        var touchPos = this.node.convertToNodeSpaceAR(touch.getLocation())
        //点与圆心的距离
        var distance = cc.pDistance(touchPos, cc.p(0, 0));

        //如果点与圆心距离小于圆的半径,控杆跟随触摸点
        if(this.radius >= distance){
            if(distance>20){
                this.node.opacity = 255;
                this.joystickBar.setPosition(touchPos);
                //更新角度
                this._getAngle(touchPos)
            }else {
                this.node.opacity = 50
                //摇杆恢复位置
                this.joystickBar.setPosition(cc.p(0,0));
                this.curAngle = null;
                //调用角度变化回调
                if(this.angleChange){
                    this.angleChange(this.curAngle);
                }
                
            }
        }else{
            //触摸监听目标
            var x = Math.cos(this._getRadian(touchPos)) * this.radius;
            var y = Math.sin(this._getRadian(touchPos)) * this.radius;
            if(touchPos.x>0 && touchPos.y<0){
                y *= -1;
            }else if(touchPos.x<0 && touchPos.y<0){
                y *= -1;
            }

            this.joystickBar.setPosition(cc.p(x, y));
            //更新角度
            this._getAngle(touchPos)
        }

    },
    onTouchEnded: function(touch, event) {
        
        this.node.opacity = 50

        //如果触摸类型为FOLLOW，离开触摸后隐藏
        if(this.touchType == TouchType.FOLLOW){
            this.node.position = this.initPos
        }
        //摇杆恢复位置
        this.joystickBar.setPosition(cc.p(0,0));
        this.curAngle = null
        //调用角度变化回调
        if(this.angleChange){
            this.angleChange(this.curAngle);
        }
    },


    //计算角度并返回
    _getAngle: function(point)
    {
        this._angle =  Math.floor(this._getRadian(point)*180/Math.PI);
        
        if(point.x>0 && point.y<0){
            this._angle = 360 - this._angle;
        }else if(point.x<0 && point.y<0){
            this._angle = 360 - this._angle;
        }else if(point.x<0 && point.y==0){
            this._angle = 180;
        }else if(point.x>0 && point.y==0){
            this._angle = 0;
        }else if(point.x==0 && point.y>0){
            this._angle = 90;
        }else if(point.x==0 && point.y<0){
            this._angle = 270;
        }
        this._updateCurAngle()
        return this._angle;
    },

    //计算弧度并返回
    _getRadian: function(point) {
        var curZ = Math.sqrt(Math.pow(point.x,2)+Math.pow(point.y,2));
        if(curZ==0){
            this._radian = 0;
        }else {
            this._radian = Math.acos(point.x/curZ);
        }
        return this._radian;
    },

    //更新当前角度
    _updateCurAngle: function()
    {
        switch (this.directionType)
        {
            case DirectionType.FOUR:
                this.curAngle = this._fourDirections();
                break;
            case DirectionType.EIGHT:
                this.curAngle = this._eightDirections();
                break;
            case DirectionType.ALL:
                this.curAngle = this._angle
                break;
            default :
                this.curAngle = null
                break;
        }
        //调用角度变化回调
        if(this.angleChange){
            this.angleChange(this.curAngle);
        }
    },


    //四个方向移动(上下左右)
    _fourDirections: function()
    {
        if(this._angle >= 45 && this._angle <= 135)
        {
            return 90
        }
        else if(this._angle >= 225 && this._angle <= 315)
        {
            return 270
        }
        else if(this._angle <= 225 && this._angle >= 180 || this._angle >= 135 && this._angle <= 180)
        {
            return 180
        }
        else if(this._angle <= 360 && this._angle >= 315 || this._angle >= 0 && this._angle <= 45)
        {
            return 0
        }
    },

    //八个方向移动(上下左右、左上、右上、左下、右下)
    _eightDirections: function()
    {
        if(this._angle >= 67.5 && this._angle <= 112.5)
        {
            return 90
        }
        else if(this._angle >= 247.5 && this._angle <= 292.5)
        {
            return 270
        }
        else if(this._angle <= 202.5 && this._angle >= 180 || this._angle >= 157.5 && this._angle <= 180)
        {
            return 180
        }
        else if(this._angle <= 360 && this._angle >= 337.5 || this._angle >= 0 && this._angle <= 22.5)
        {
            return 0
        }
        else if(this._angle >= 112.5 && this._angle <= 157.5)
        {
            return 135
        }
        else if(this._angle >= 22.5 && this._angle <= 67.5)
        {
            return 45
        }
        else if(this._angle >= 202.5 && this._angle <= 247.5)
        {
            return 225
        }
        else if(this._angle >= 292.5 && this._angle <= 337.5)
        {
            return 315
        }
    },

    onDestroy: function()
    {
        cc.eventManager.removeListener(this._listener);
    }

});
