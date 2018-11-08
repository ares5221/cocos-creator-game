
cc.Class({
    extends: cc.Component,

    properties: {
        audioControl: require('AudioControl'),
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        drag: 1000,
        direction: 0,
        jumpSpeed: 300,
        runVoiceLevel: 15,
        jumpVoiceLevel: 40,
        jumpAudio: cc.AudioClip,
        dieAudio: cc.AudioClip,
        deathFrame: cc.SpriteFrame,
        replayBtn: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        
        // this.registerEvent();

        this.prePosition = cc.v2();
        this.preStep = cc.v2();

        this.touchingNumber = 0;

        this._startPoint = cc.v2(this.node.x, this.node.y);
        this._dead = false;
    },

    replay: function () {
        this.replayBtn.active = false;

        this.collisionX = 0;
        this.collisionY = 0;
        this.speed.x = 0;
        this.speed.y = 0;
        this.direction = 0;
        this.prePosition.x = 0;
        this.prePosition.y = 0;
        this.preStep.x = 0;
        this.preStep.y = 0;
        this.touchingNumber = 0;
        this._dead = false;

        this.node.x = this._startPoint.x;
        this.node.y = this._startPoint.y;
        this.getComponent(cc.Animation).play('stand');
    },

    registerEvent: function () {
        //add keyboard input listener to call turnLeft and turnRight
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
    },
    
    onDisabled: function () {
        cc.director.getCollisionManager().enabled = false;
        // cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    
    onKeyPressed: function (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.direction = -1;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 1;
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                if (!this.jumping) {
                    this.jumping = true;
                    this.speed.y = this.jumpSpeed;    
                }
                break;
        }
    },
    
    onKeyReleased: function (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 0;
                break;
        }
    },
    
    onCollisionEnter: function (other, self) {
        // this.node.color = cc.Color.RED;

        this.touchingNumber ++;

        var transParent = this.node.parent.getNodeToWorldTransformAR();
        
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        var appx = this.node.anchorX * selfAabb.width;
        var appy = this.node.anchorY * selfAabb.height;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                this.node.x = otherPreAabb.xMax - transParent.tx + appx;
                this.collisionX = -1;
            }
            else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                this.node.x = otherPreAabb.xMin - selfPreAabb.width - transParent.tx + appx;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            other.touchingX = true;
            return;
        }

        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - transParent.ty + appy;
                this.jumping = false;
                this.collisionY = -1;
            }
            else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - transParent.ty + appy;
                this.speed.y = 0;
                this.collisionY = 1;
            }
            
            this.speed.y = 0;
            other.touchingY = true;
        }    
        
    },
    
    onCollisionStay: function (other, self) {
        if (this.collisionY === -1) {
            if (other.node.group === 'Platform') {
                var motion = other.node.getComponent('PlatformMotion');
                if (motion) {
                    this.node.x += motion._movedDiff;
                }
            }

            // this.node.y = other.world.aabb.yMax;

            // var offset = cc.v2(other.world.aabb.x - other.world.preAabb.x, 0);
            
            // var temp = cc.affineTransformClone(self.world.transform);
            // temp.tx = temp.ty = 0;
            
            // offset = cc.pointApplyAffineTransform(offset, temp);
            // this.node.x += offset.x;
        }
    },
    
    onCollisionExit: function (other) {
        this.touchingNumber --;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.jumping = true;
        }
    },
    
    update: function (dt) {
        if (this._dead) {
            return;
        }
        var voiceLevel = this.audioControl.voiceLevel;
        var animation = this.getComponent(cc.Animation);

        // Voice control jump
        if (!this.jumping && voiceLevel > this.jumpVoiceLevel) {
            this.jumping = true;
            this.direction = 1;
            this.speed.y = voiceLevel / 100 * this.jumpSpeed;
            cc.audioEngine.play(this.jumpAudio, false, 1);
            animation.play('jump');
        }

        if (!this.jumping) {
            var runState = animation.getAnimationState('run');
            var standState = animation.getAnimationState('stand');
            // Voice control run
            if (voiceLevel > this.runVoiceLevel) {
                this.direction = 1;
                if (!runState.isPlaying) {
                    animation.play('run');
                }
            }
            else {
                this.direction = 0;
                if (!standState.isPlaying) {
                    animation.play('stand');
                }
            }
        }

        if (this.collisionY >= 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            }
            else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        }
        else {
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }
        
        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;
        
        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;

        if (this.node.y < -90) {
            this._dead = true;
            cc.audioEngine.play(this.dieAudio, false, 1);
            animation.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.deathFrame;
            this.replayBtn.active = true;
        }
    },
});
