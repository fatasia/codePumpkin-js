var that;
var actionIndex = 0;
var GameLayer = cc.Layer.extend({
    DEFAULT_SIZE: 60,
    DEFAULT_TIME: 0.15,
    PUMPKIN_COUNT: 5,
    BUSH_COUNT: 5,
    currentAccount: {},
    gameData: {
        accountList: [],
        pumpkinList: [],
        bushList: [],
        stepPromptList: [],     // 步数提示
    },
    size: 0,
    initBG: function () {
        //背景
        this.bgSprite = new cc.Sprite(res.grassBig);
        this.bgSprite.setPosition(this.size.width / 2, this.size.height / 2);
        this.bgSprite.setScaleX(this.size.width / this.bgSprite.width);
        this.bgSprite.setScaleY(this.size.height / this.bgSprite.height);
        this.addChild(this.bgSprite, 0);
        //左下角的龙
        this.grad = new cc.Sprite(res.dragonBody);
        this.grad.setName("grad");
        this.grad.attr({
            x: this.grad.width * 0.2,
            y: this.grad.height * 0.2,
            scale: 0.4
        });
        this.addChild(this.grad, 10);
    },
    initCtrlView: function () {
        // step
        this.step = new cc.Sprite(res.step);
        this.step.attr({
            x: this.size.width * 0.6,
            y: this.step.height / 2 + 10
        });
        this.addChild(this.step, 11);
        // turn
        this.turn = new cc.Sprite(res.turn);
        this.turn.attr({
            x: this.size.width * 0.8,
            y: this.turn.height / 2 + 10
        });
        this.addChild(this.turn, 11);

        this.left = new cc.Sprite(res.left);
        this.left.setName('left');
        this.left.attr({
            x: this.size.width * 0.8 - 40,
            y: this.turn.height + 30,
            scale: 0.7
        });
        this.addChild(this.left, 11);

        this.right = new cc.Sprite(res.right);
        this.right.setName('right');

        this.right.attr({
            x: this.size.width * 0.8 + 40,
            y: this.turn.height + 30,
            scale: 0.7
        });
        this.addChild(this.right, 11);

        // this.stepCtrlList = [];

        this.stepBox = new cc.Node();
        this.stepBox.setName("stepBox");
        this.addChild(this.stepBox);


        var s1 = this.createStepText("-60", cc.p(this.size.width * 0.6 - 30, this.step.height + 40), -60, "sSubtract");
        var s2 = this.createStepText("+60", cc.p(this.size.width * 0.6 + 30, this.step.height + 40), 60, "sPlus");


        // this.stepCtrlList.push(s1);
        // this.stepCtrlList.push(s2);

        this.addChild(s1);
        this.addChild(s2);

    },
    rePlay: function () {
        this.initView();
        // 回到开始、轮询事件
        actionIndex = 0;
        this.actionLoop(this.currentAccount);
        //遍历事件
        // var length = this.currentAccount.actionList.length;
        // for (var i = 0; i < length; i++) {
        //     if (this.currentAccount.actionList[i].action == 1) {      //移动
        //         this.move(this.currentAccount, this.currentAccount.actionList[i].value);
        //     } else {                                                  //旋转
        //         this.rota(this.currentAccount, this.currentAccount.actionList[i].value);
        //     }
        //
        // }
    },
    /**判断触摸点是否重合*/
    isContainsPoint: function (touch, target) {
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        return cc.rectContainsPoint(rect, locationInNode)
    },
    /**判断点面是否重合*/
    isContainsPointByView: function (view, p) {
        return cc.rectContainsPoint(view.getBoundingBox, p);
    },
    /**判断面面是否重合*/
    isContainsRect: function (view1, view2) {
        var rect1 = view1.getBoundingBox();
        var rect2 = view2.getBoundingBox();
        return cc.rectIntersectsRect(rect1, rect2);
    },
    createListener: function (Fun) {
        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                //判断触摸点是否在指定控件当中
                var target = event.getCurrentTarget();

                // 反向监听
                if (that.isContainsPoint(touch, target.getChildByName('left'))) {
                    cc.log('left');
                    that.actionHandler({type: 2, value: 1});
                    // that.rota(that.currentAccount,1);
                    // return true;
                }

                if (that.isContainsPoint(touch, target.getChildByName('right'))) {
                    cc.log('right');
                    that.actionHandler({type: 2, value: 2});

                    //    that.rota(that.currentAccount,2);
                    // return true;
                }

                if (that.isContainsPoint(touch, target.getChildByName('sSubtract'))) {
                    cc.log('sSubtract');
                    // that.move(that.currentAccount,-60);
                    that.actionHandler({type: 1, value: -60});

                    // return true;
                }

                if (that.isContainsPoint(touch, target.getChildByName('sPlus'))) {
                    cc.log('sPlus');
                    // that.move(that.currentAccount,60);
                    that.actionHandler({type: 1, value: 60});

                    // return true;
                }

                // 重放
                if (that.isContainsPoint(touch, target.getChildByName('grad'))) {
                    that.rePlay();
                }


                //步数
                var stList = target.getChildByName("stepBox").getChildren();
                cc.log(stList);
                for (var i = 0; i < stList.length; i++) {
                    if (that.isContainsPoint(touch, stList[i])) {
                        that.actionHandler({type: 1, value: stList[i].stepValue});
                    }
                }


                return false;
            }
        });
    },
    /**创建步数提示*/
    createStepText: function (t, p, value, name) {
        console.log(p);
        var text = new cc.LabelTTF(t, res.fontArial, 20);
        text.setColor(cc.color(0, 0, 0, 255));
        text.setName(name);
        text.stepValue = value;
        // text.setFontFillColor(cc.color(255,255,255,255));
        //text.setBackGroundColor(cc.color.BLACK);
        //enableOutline
        console.log(text);
        // text._setShadowOffsetX(10);
        // text._setShadowOffsetY(10);
        // text._setShadowBlur(2);
        // text._setStrokeStyle(cc.color(255,255,255,255));
        //  text.enableGlow(cc.color.BLACK,2);
        // text.enableOutline(cc.color.BLACK,2);
        text.setPosition(p);
        return text;
    },
    /**创建玩家*/
    createAccount: function (actionList, direction) {
        var acc = new cc.Sprite(res.dragonHead);
        var size = cc.winSize;

        //var x = acc.width/2+size.width/2*cc.random0To1();
        acc.attr({
            x: size.width / 2,
            y: acc.height,
            scale: 1.5
        });
        acc.startPosition = {x: acc.getPositionX(), y: acc.getPositionY()};
        acc.direction = direction != null && direction != undefined ? direction : 1;  //方向  1上  2右  3下  4左
        acc.actionList = actionList != null && actionList != undefined ? actionList : [];
        return acc;
    },
    /**检测位置是否已经有控件存在*/
    checkPosition: function (view) {
        if (this.isContainsRect(this.currentAccount, view)) {
            return false;
        }
        for (var i = 0; i < this.gameData.bushList.length; i++) {
            if (this.isContainsRect(this.gameData.bushList[i], view)) {
                return false;
            }
        }
        for (var i = 0; i < this.gameData.pumpkinList.length; i++) {
            if (this.isContainsRect(this.gameData.pumpkinList[i], view)) {
                return false;
            }
        }
        return true;
    },
    createStepPromptPosition: function () {          //为步数提示栏确认位置
        cc.log(this.gameData.stepPromptList);
        if (this.gameData.stepPromptList.length >= 1) {
            var item = this.gameData.stepPromptList[this.gameData.stepPromptList.length - 1].getPosition();
            cc.log(item);
            return cc.p(item.x + 60, item.y);
        } else {
            return cc.p(this.size.width * 0.6 - 30, 130);
        }
    },
    createStepPrompt: function () {   // 遍历南瓜，创建步数提示
        this.gameData.stepPromptList = [];
        this.getChildByName("stepBox").removeAllChildren(true);
        var p = this.currentAccount.getPosition();
        for (var i = 0; i < this.gameData.pumpkinList.length; i++) {

            if (!this.gameData.pumpkinList[i].delete) {
                var b = this.gameData.pumpkinList[i].getBoundingBox();
                if (this.currentAccount.direction % 2 != 0) {   // x轴方向
                    if (p.x > b.x && p.x < b.x + b.width) {   // x轴重合
                        var t = parseInt(b.y - p.y + 10);

                        this.gameData.stepPromptList.push(this.createStepText((t > 0 ? "+" + t : t), this.createStepPromptPosition(), t));
                        this.stepBox.addChild(this.gameData.stepPromptList[this.gameData.stepPromptList.length - 1]);
                    }
                } else {                                        // y轴方向
                    if (p.y > b.y && p.y < b.y + b.height) {   // y轴重合
                        var t = parseInt(b.x - p.x + 10);
                        this.gameData.stepPromptList.push(this.createStepText((t > 0 ? "+" + t : t), this.createStepPromptPosition(), t));
                        this.stepBox.addChild(this.gameData.stepPromptList[this.gameData.stepPromptList.length - 1]);
                    }
                }
            }


        }

        cc.log(this.gameData.stepPromptList);
        // for (var i =0;i<this.gameData.stepPromptList.length;i++){
        //
        // }

        // if(){p.getX()
        //
        // }
    },
    randomPosition: function (view) { //随机位置
        var p;
        while (true) {
            p = cc.p((this.size.width - 200) * cc.random0To1() + 100, (this.size.height - 200) * cc.random0To1() + 200);
            view.setPosition(p);
            // cc.log("random:"+JSON.stringify(p));
            if (this.checkPosition(view)) {
                break;
            }
        }
        ;
    },
    updateView: function () {
        //遍历吃南瓜
        var isEat = false;
        for (var j = 0; j < this.gameData.pumpkinList.length; j++) {
            // cc.log( this.currentAccount.getBoundingBox());
            // cc.log(this.gameData.pumpkinList[0].getBoundingBox());
            // cc.log(cc.rectIntersectsRect(this.currentAccount.getBoundingBox(),this.gameData.pumpkinList[0].getBoundingBox()));

            if (this.isContainsRect(this.currentAccount, this.gameData.pumpkinList[j])) {
                this.gameData.pumpkinList[j].delete = true;
                this.gameData.pumpkinList[j].setOpacity(0);
                //this.removeChild( this.gameData.pumpkinList[j]);

                //this.gameData.pumpkinList.splice(j,1);
                // this.gameData.pumpkinList.
                if(j == this.gameData.pumpkinList.length - 1){
                    isEat = true;
                }
            }
        }

        if (isEat){
            alert("通关成功");
        }

        //遍历障碍物
        for (var j = 0; j < this.gameData.bushList.length; j++) {
            // cc.log( this.currentAccount.getBoundingBox());
            // cc.log(this.gameData.pumpkinList[0].getBoundingBox());
            // cc.log(cc.rectIntersectsRect(this.currentAccount.getBoundingBox(),this.gameData.pumpkinList[0].getBoundingBox()));

            if (this.isContainsRect(this.currentAccount, this.gameData.bushList[j])) {
                //this.removeChild(this.gameData.bushList[j]);
                alert("游戏结束");
            }
        }

        //创建步数提示
        this.createStepPrompt();
    },
    createPumpkin: function () {
        var pum = new cc.Sprite(res.pumpkin);
        // var x = (this.size.width - pum.width) * cc.random0To1() + pum.width;
        // var y = (this.size.height - pum.height) * cc.random0To1() + pum.height;
        // console.log(x + "," + y);
        // pum.attr({
        //     x: x,
        //     y: y
        // });
        cc.log(pum);
        this.randomPosition(pum);

        return pum;
    },
    createObstacle: function () {
        var obj = new cc.Sprite(res.bush);
        // var x = (this.size.width - obj.width) * cc.random0To1() + obj.width;
        // var y = (this.size.height - obj.height) * cc.random0To1() + obj.height;
        // console.log(x + "," + y);
        // obj.attr({
        //     x: x,
        //     y: y
        // });
        this.randomPosition(obj);
        return obj;
    },
    actionHandler: function (action) {

        // if (this.first){
        this.currentAccount.actionList.push(action);
        //  }


        this.actionLoop(this.currentAccount);
    },
    /**封装接口数据到事件*/
    dataToAction: function (acc, action) {
        var a;
        if (action.type == 1) {      //移动
            a = this.createMoveAction(acc, action.value);
        } else {                                                  //旋转
            a = this.createRotaAction(acc, action.value);
        }
        return a;
    },
    /**事件轮询*/
    actionLoop: function (acc) {
        //acc.runAction(action);
        if (actionIndex < acc.actionList.length) {
            acc.runAction(cc.sequence(that.dataToAction(acc, acc.actionList[actionIndex]), cc.callFunc(function () {
                if (acc.actionList[actionIndex].type == 2) {
                    if (acc.actionList[actionIndex].value == 1) {
                        if (acc.direction > 1) {
                            acc.direction--;
                        } else {
                            acc.direction = 4;
                        }
                    } else {
                        if (acc.direction < 4) {
                            acc.direction++;
                        } else {
                            acc.direction = 1;
                        }
                    }
                }
                that.updateView();
                actionIndex++;
                if (actionIndex < acc.actionList.length) {
                    that.actionLoop(acc, that.dataToAction(acc, acc.actionList[actionIndex]));
                }

            })));
        }

    },
    /**移动*/
    createMoveAction: function (acc, step) {

        var moveAction;
        switch (acc.direction) {        //方向  上、右、下、左
            case 1:
            default:
                moveAction = cc.MoveBy.create((Math.abs(step) / this.DEFAULT_SIZE) * this.DEFAULT_TIME, cc.p(0, step));
                break;
            case 2:
                moveAction = cc.MoveBy.create((Math.abs(step) / this.DEFAULT_SIZE) * this.DEFAULT_TIME, cc.p(step, 0));
                break;
            case 3:
                moveAction = cc.MoveBy.create((Math.abs(step) / this.DEFAULT_SIZE) * this.DEFAULT_TIME, cc.p(0, ~step));
                break;
            case 4:
                moveAction = cc.MoveBy.create((Math.abs(step) / this.DEFAULT_SIZE) * this.DEFAULT_TIME, cc.p(~step, 0));
                break;

        }

        return moveAction;
        // acc.setPosition();

        //acc.cleanup();
        // acc.runAction(moveAction);
        //  acc.runAction(cc.sequence(moveAction,cc.callFunc(function () {
        //      that.updateView();
        //  })));
        //acc.runAction(cc.Sequences(moveAction,))

    },
    /**旋转事件*/
    createRotaAction: function (acc, type) {  // 1左   2右


        if (type == 1) {
            // if (acc.direction > 1) {
            //     acc.direction--;
            // } else {
            //     acc.direction = 4;
            // }
            return cc.RotateBy.create(this.DEFAULT_TIME, -90);

            //  acc.setRotation(-90);
        } else {
            // if (acc.direction < 4) {
            //     acc.direction++;
            // } else {
            //     acc.direction = 1;
            // }
            //acc.setRotation(90);
            return cc.RotateBy.create(this.DEFAULT_TIME, 90);

        }

        // this.createStepPrompt();


    },
    ctor: function () {   //入口
        this._super();
        this.size = cc.winSize;
        that = this;

        this.first = true;

        this.initBG();
       this.initCtrlView();
      this.initView();

        //全局事件
       cc.eventManager.addListener(this.createListener(), this);

       this.first = false;

        return true;
    },
    initView: function () {

        // if(!this.first){
        //     this.removeChild(this.currentAccount,true);
        //     this.removeChild(this.pumpkinBox,true);
        //     this.removeChild(this.bushBox,true);
        // }
        this.removeChild(this.currentAccount, true);
        this.currentAccount = this.createAccount(this.currentAccount.actionList, 1);
        this.gameData.accountList[0] = this.currentAccount;
        //this.addChild(this.currentAccount,true);
        this.pumpkinBox = new cc.Node();
        this.bushBox = new cc.Node();
        if (this.first) {
            this.gameData.accountList.push(this.currentAccount);
            //遍历添加南瓜和障碍物
            for (var i = 0; i < this.PUMPKIN_COUNT; i++) {
                this.gameData.pumpkinList.push(this.createPumpkin());
                this.pumpkinBox.addChild(this.gameData.pumpkinList[i], 2);
            }

            for (var i = 0; i < this.BUSH_COUNT; i++) {
                this.gameData.bushList.push(this.createObstacle());
                this.bushBox.addChild(this.gameData.bushList[i], 2);
            }
            this.addChild(this.pumpkinBox);
            this.addChild(this.bushBox);
        } else {

            // this.removeAllChildren(true);
            for (var i = 0; i < this.PUMPKIN_COUNT; i++) {
                this.gameData.pumpkinList[i].setOpacity(255);
            }

        }

        this.addChild(this.gameData.accountList[0], 10);


        this.createStepPrompt();
    }

});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});